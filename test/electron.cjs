'use strict';
// Optional native webview check, isolated from the user's Harness profile.
const { _electron } = require('playwright');
const electron = require('electron');
const { buildSync } = require('esbuild');
const { GUEST_INSTALL } = require('../src/guest.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'annotate-electron-'));
const capture = buildSync({ stdin: { contents: "window.capture = require('./src/capture.cjs')", resolveDir: path.join(__dirname,'..') }, bundle:true,platform:'browser',write:false }).outputFiles[0].text;
fs.writeFileSync(path.join(root,'capture.js'),capture);
fs.writeFileSync(path.join(root,'guest.html'), '<html><body style="margin:0;background:rgb(60,120,210);height:2200px"><div style="height:300px;background:orange"></div></body></html>');
fs.writeFileSync(path.join(root,'host.html'), `<html><body style="margin:0"><webview style="position:absolute;left:100px;top:80px;width:600px;height:450px" webpreferences="backgroundThrottling=no" src="file://${root}/guest.html"></webview><script src="capture.js"></script></body></html>`);
fs.writeFileSync(path.join(root,'main.cjs'), `const {app,BrowserWindow}=require('electron');app.setPath('userData',${JSON.stringify(path.join(root,'profile'))});app.whenReady().then(()=>{const w=new BrowserWindow({width:1000,height:700,show:true,webPreferences:{webviewTag:true,backgroundThrottling:false}});w.loadFile(${JSON.stringify(path.join(root,'host.html'))});});`);
(async()=>{
 const app=await _electron.launch({executablePath:electron,args:[path.join(root,'main.cjs')]});
 try {
  const page=await app.firstWindow();
  await page.waitForFunction(()=>!!document.querySelector('webview')?.getWebContentsId());
  await page.evaluate(()=>{
    document.querySelector('webview').addEventListener('console-message',(e)=>{
      if(e.message?.startsWith('__DSH_ANNOTATE__')){
        const payload=JSON.parse(e.message.slice('__DSH_ANNOTATE__'.length));
        if(payload.kind==='region'||payload.kind==='pick') window.lastGuestPick=payload;
      }
    });
  });
  const id=await page.evaluate(()=>document.querySelector('webview').getWebContentsId());
  for(const zoom of [1,1.5,2]){
    await page.evaluate(async(zoom)=>{const wv=document.querySelector('webview');wv.setZoomFactor(zoom);await wv.executeJavaScript('scrollTo(0,400)');},zoom);
    await page.waitForTimeout(100);
    await page.evaluate((code)=>document.querySelector('webview').executeJavaScript(code),GUEST_INSTALL.replaceAll('__ACCENT__','#ff0000').replaceAll('__ON_ACCENT__','#fff'));
    await page.evaluate(()=>{window.lastGuestPick=null;});
    await app.evaluate(({webContents},id)=>{
      const guest=webContents.fromId(id); guest.focus();
      guest.sendInputEvent({type:'mouseDown',x:100,y:100,button:'left',clickCount:1});
      guest.sendInputEvent({type:'mouseUp',x:100,y:100,button:'left',clickCount:1});
    },id);
    await page.waitForFunction(()=>window.lastGuestPick?.kind==='pick');
    await page.evaluate(async()=>{
      await document.querySelector('webview').executeJavaScript('window.__dshAnnotate.resume()');
      window.lastGuestPick=null;
    });
    await app.evaluate(({webContents},id)=>{
      const guest=webContents.fromId(id); guest.focus();
      guest.sendInputEvent({type:'mouseMove',x:400,y:300});
      guest.sendInputEvent({type:'mouseDown',x:400,y:300,button:'left',clickCount:1});
      guest.sendInputEvent({type:'mouseMove',x:100,y:100,button:'left',modifiers:['leftButtonDown']});
      guest.sendInputEvent({type:'mouseUp',x:100,y:100,button:'left',clickCount:1});
    },id);
    await page.waitForFunction(()=>window.lastGuestPick?.kind==='region');
    const result=await page.evaluate(async()=>{
      const {rect,viewport}=window.lastGuestPick;
      const url=await capture.captureGuest(document.querySelector('webview'),rect,viewport);
      const im=new Image();im.src=url;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
      return {url,rect,viewport,width:c.width,height:c.height,samples:[[0,0],[c.width-1,0],[0,c.height-1],[c.width-1,c.height-1]].map(([x,y])=>[...g.getImageData(x,y,1,1).data])};
    });
    // Native macOS captures may round a channel during color-profile conversion.
    result.samples.forEach((sample)=>sample.forEach((channel,index)=>assert.ok(Math.abs(channel-[60,120,210,255][index])<=2)));
    assert.ok(result.width>0 && result.height>0 && result.width<=1600 && result.height<=1600);
    const expectedRatio=result.rect.width/result.rect.height;
    assert.ok(Math.abs(result.width/result.height-expectedRatio)<0.03);
    fs.writeFileSync(path.join(root,'guest-zoom-'+zoom+'.png'),Buffer.from(result.url.split(',')[1],'base64'));
    console.log('PASS native Electron webview click+drag zoom='+zoom+' crop='+result.width+'x'+result.height+' CSS rect='+JSON.stringify(result.rect));
  }
  console.log('Native PNG evidence: '+root);
 } finally {await app.close();}
})().catch((e)=>{console.error(e);process.exitCode=1;});
