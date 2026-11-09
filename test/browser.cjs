'use strict';
// Optional real-browser checks. Supply React/ReactDOM and Playwright via NODE_PATH;
// the production package does not depend on this test harness.
const { chromium } = require('playwright');
const { buildSync } = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const fixture = buildSync({ stdin: { contents: `
const React = require('react');
const { createRoot } = require('react-dom/client');
const plugin = require('./src/client.cjs');
const registrations = {};
let dict;
const ctx = {
 effect(fn) { fn(); },
 locale: { register(ns, value) { dict = value.en; }, bind() { return (key, params = {}) =>
   (dict[key] || key).replace(/\\{(\\w+)\\}/g, (_, name) => params[name] ?? ''); } },
 slots: { inject(name, fn) { fn(); }, register(spec, fn) { registrations[spec.id] = fn; } },
 get(name) {
   if (name === 'sessions') return { binding: () => ({ session: { id: 'test' } }) };
   if (name === 'conversation') return {
     createDrafts(id, files) { window.attachments = files; return files.map((_, i) => ({ id: 'file-' + i })); },
     async sendSession(session, text, ids) { window.sent = { text, ids }; return { kind: 'success' }; }
   };
 }
};
plugin.apply(ctx);
createRoot(document.getElementById('controls')).render(React.createElement(React.Fragment, null,
 registrations['annotate-anything-trigger']({ sessionId: 'test' }), registrations['annotate-anything-overlay']()));
`, resolveDir: path.join(__dirname, '..') }, bundle: true, platform: 'browser', write: false,
  nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean) }).outputFiles[0].text;
const { GUEST_INSTALL } = require('../src/guest.cjs');
const captureBundle = buildSync({ stdin: { contents: `window.capture = require('./src/capture.cjs')`, resolveDir: path.join(__dirname, '..') },
  bundle: true, platform: 'browser', write: false }).outputFiles[0].text;
const launch = { headless: true };
if (process.env.CHROMIUM_EXECUTABLE) launch.executablePath = process.env.CHROMIUM_EXECUTABLE;
const html = `<html><head><style>
html,body{margin:0;background:#fff;width:100%;height:100%;font-family:Arial}
:root{--dsw-alias-bg-overlay:#fff;--dsw-alias-label-primary:#111;--dsw-alias-brand-primary:#1461ee;--dsw-alias-border-l2:#888}
#target{position:absolute;left:80px;top:80px;width:300px;height:200px;background:rgb(15,170,90)}
#scroller{position:absolute;left:450px;top:80px;width:200px;height:200px;overflow:auto}
#controls{position:fixed;top:5px;left:5px}
</style></head><body><div id="target"></div><div id="scroller"><div style="height:100px;background:rgb(230,20,20)"></div><div style="height:300px;background:rgb(20,60,230)"></div></div><div id="controls"></div></body></html>`;
async function pixels(page, data) {
  return page.evaluate(async (url) => {
    const im = new Image(); im.src = url; await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    return { width: c.width, height: c.height, pixel: [...g.getImageData(c.width >> 1, c.height >> 1, 1, 1).data] };
  }, data);
}
async function uniform(page, url, color) {
  const samples = await page.evaluate(async (url) => {
    const im=new Image(); im.src=url; await im.decode(); const c=document.createElement('canvas');
    c.width=im.naturalWidth; c.height=im.naturalHeight; const g=c.getContext('2d'); g.drawImage(im,0,0);
    return [[0,0],[c.width-1,0],[0,c.height-1],[c.width-1,c.height-1]].map(([x,y])=>[...g.getImageData(x,y,1,1).data]);
  },url);
  samples.forEach((sample)=>assert.deepEqual(sample,color));
}
async function drag(page, a, b) {
  await page.mouse.move(...a); await page.mouse.down(); await page.mouse.move(...b, { steps: 4 }); await page.mouse.up();
}
async function saveAndSend(page, comment) {
  await page.getByPlaceholder('What should change here?').fill(comment);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: /^Send/ }).click();
  await page.waitForFunction(() => !!window.sent);
  return page.evaluate(async () => {
    const urls = await Promise.all(window.attachments.map((file) => new Promise((resolve) => {
      const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(file);
    })));
    return { ...window.sent, urls };
  });
}
(async () => {
  const browser = await chromium.launch(launch);
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'annotate-browser-'));
  try {
    for (const dpr of [1, 2]) {
      const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: dpr });
      const page = await context.newPage();
      const failures = []; page.on('pageerror', (e) => failures.push(e.message));
      await page.setContent(html); await page.addScriptTag({ content: fixture });
      await page.getByRole('button', { name: 'Annotate', exact: true }).click();
      await page.getByRole('button', { name: 'Region', exact: true }).click();
      // Tiny click, Escape during drag, resize, scrolling and lost pointer capture must not open a card.
      await drag(page, [100, 100], [101, 101]);
      assert.equal(await page.locator('textarea').count(), 0);
      await page.mouse.move(100,100); await page.mouse.down(); await page.mouse.move(200,180);
      await page.keyboard.press('Escape'); await page.mouse.up();
      assert.equal(await page.locator('textarea').count(), 0);
      await page.mouse.move(100,100); await page.mouse.down();
      await page.evaluate(() => window.dispatchEvent(new Event('resize'))); await page.mouse.up();
      assert.equal(await page.locator('textarea').count(), 0);
      for (const kind of ['scroll', 'pointercancel', 'lostpointercapture']) {
        await page.mouse.move(100,100); await page.mouse.down(); await page.mouse.move(200,180);
        await page.evaluate((kind) => {
          if (kind === 'scroll') window.dispatchEvent(new Event('scroll'));
          else document.getElementById('target').dispatchEvent(new PointerEvent(kind, {pointerId:1,bubbles:true}));
        }, kind);
        await page.mouse.up();
        assert.equal(await page.locator('textarea').count(), 0);
      }
      // Reverse selection, mixed items and PNG transmission.
      await drag(page, [280, 180], [80, 80]);
      await page.getByRole('button', { name: 'Add', exact: true }).waitFor({ state: 'visible' });
      await page.waitForFunction(() => !document.querySelector('.dsh-annot-card button:last-child').disabled);
      await page.getByPlaceholder('What should change here?').fill('green region');
      await page.getByRole('button', { name: 'Add', exact: true }).click();
      await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
      await page.getByRole('button', { name: 'Edit annotation 1', exact: true }).click();
      await page.getByPlaceholder('What should change here?').fill('green region');
      await page.getByRole('button', { name: 'Add', exact: true }).click();
      await page.getByRole('button', { name: 'Element', exact: true }).click();
      await page.mouse.click(300,220);
      const sent = await saveAndSend(page, 'element');
      assert.equal(sent.urls.length, 2); assert.deepEqual(sent.ids, ['file-0','file-1']);
      assert.match(sent.text, /1\. Selected region — green region/); assert.match(sent.text, /x=80, y=80, width=200, height=100/);
      assert.match(sent.text, /2\..*element/);
      assert.deepEqual(await pixels(page, sent.urls[0]), { width: 200, height: 100, pixel: [15,170,90,255] });
      await uniform(page,sent.urls[0],[15,170,90,255]);
      fs.writeFileSync(path.join(output, 'host-dpr-' + dpr + '.png'), Buffer.from(sent.urls[0].split(',')[1], 'base64'));
      // Test the production DOM capture against a nested scroller and root scrolling.
      await page.addScriptTag({ content: captureBundle });
      await page.evaluate(() => { document.getElementById('scroller').scrollTop = 100; });
      const scrolled = await page.evaluate(() => capture.captureHostRegion({ x: 470, y: 100, width: 100, height: 100 }));
      assert.deepEqual((await pixels(page, scrolled)).pixel, [20,60,230,255]);
      await page.evaluate(() => { document.body.style.height = '2000px'; window.scrollTo(0, 50); });
      const rootScroll = await page.evaluate(() => capture.captureHostRegion({ x: 100, y: 50, width: 100, height: 100 }));
      assert.deepEqual((await pixels(page, rootScroll)).pixel, [15,170,90,255]);
      await page.evaluate(() => { const el=document.createElement('div'); el.style.cssText='position:fixed;left:80px;top:400px;width:100px;height:100px;background:rgb(150,40,180)';document.body.appendChild(el); });
      const fixed = await page.evaluate(() => capture.captureHostRegion({ x:90,y:410,width:70,height:70 }));
      assert.deepEqual((await pixels(page, fixed)).pixel,[150,40,180,255]);
      await uniform(page,fixed,[150,40,180,255]);
      assert.deepEqual(failures, []);
      await context.close();
      console.log('PASS host: region, mixed attachments, cancellation, scrolling; DPR=' + dpr);
    }
    // Guest page at 2x raster density, displayed at half-size in the host.
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
    const host = await context.newPage(), guest = await context.newPage();
    await guest.setViewportSize({ width: 800, height: 600 });
    await guest.setContent('<html><body style="margin:0;background:rgb(60,120,210);height:1800px"><div style="height:300px;background:rgb(240,170,20)"></div></body></html>');
    await host.setContent(html.replace('<div id="controls">', '<webview style="position:absolute;left:700px;top:80px;width:400px;height:300px"></webview><div id="controls">'));
    await host.exposeFunction('guestExec', (code) => guest.evaluate(code));
    await host.exposeFunction('guestCapture', async () => (await guest.screenshot()).toString('base64'));
    guest.on('console', (message) => {
      if (message.text().startsWith('__DSH_ANNOTATE__')) host.evaluate((text) => {
        const e = new Event('console-message'); e.message = text; document.querySelector('webview').dispatchEvent(e);
      }, message.text()).catch(() => {});
    });
    await host.evaluate(() => {
      const wv = document.querySelector('webview');
      wv.executeJavaScript = (code) => window.guestExec(code);
      wv.capturePage = async () => { const data = await window.guestCapture(); return { toDataURL: () => 'data:image/png;base64,' + data }; };
    });
    await host.addScriptTag({ content: fixture });
    await host.getByRole('button', { name: 'Annotate', exact: true }).click();
    await host.getByRole('button', { name: 'Region', exact: true }).click();
    await guest.waitForFunction(() => !!window.__dshAnnotate);
    await guest.evaluate(() => scrollTo(0,300));
    await guest.waitForTimeout(100);
    await drag(guest, [400, 250], [100,100]);
    await host.getByPlaceholder('What should change here?').waitFor();
    await host.waitForFunction(() => !document.querySelector('.dsh-annot-card button:last-child').disabled);
    // Host outline scales guest CSS geometry by the guest surface's actual size.
    const outline = await host.locator('.dsh-annot-hover').first().boundingBox();
    assert.deepEqual(outline, { x: 750, y: 130, width: 150, height: 75 });
    const sent = await saveAndSend(host, 'guest region');
    assert.equal(sent.urls.length, 1); assert.match(sent.text, /browser region.*x=100, y=100, width=300, height=150/);
    assert.deepEqual(await pixels(host, sent.urls[0]), { width:600,height:300,pixel:[60,120,210,255] });
    await uniform(host,sent.urls[0],[60,120,210,255]);
    fs.writeFileSync(path.join(output, 'guest.png'), Buffer.from(sent.urls[0].split(',')[1], 'base64'));
    // Overlay suppression is restored even when capturePage fails.
    await guest.evaluate(GUEST_INSTALL.replace('__MODE__','region').replaceAll('__ACCENT__','#f00').replaceAll('__ON_ACCENT__','#fff'));
    await host.addScriptTag({ content: captureBundle });
    const failure = await host.evaluate(async () => {
      const wv = document.querySelector('webview');
      wv.capturePage = async () => { throw new Error('test capture failure'); };
      try { await capture.captureGuest(wv, {x:10,y:10,width:100,height:100}); } catch (e) { return e.message; }
    });
    assert.equal(failure, 'test capture failure');
    const state = await guest.evaluate(async () => {
      const api=window.__dshAnnotate;
      const first=await api.prepareCapture(null); api.finishCapture();
      scrollTo(0,400); await new Promise(requestAnimationFrame);
      return { stale:await api.prepareCapture(first), exists:!!document.querySelector('[data-dsh-annotate]') };
    });
    assert.equal(state.stale,null); assert.equal(state.exists,true);
    await drag(guest,[100,100],[200,200]);
    await guest.waitForTimeout(100);
    await context.close();
    console.log('PASS guest: reverse drag, scroll, scaled host outline, 2x cropped attachment, capture failure cleanup');
    console.log('PNG evidence: ' + output);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
