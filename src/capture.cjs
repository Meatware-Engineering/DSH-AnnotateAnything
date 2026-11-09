'use strict';
const { toPng, toSvg } = require('html-to-image');
const { clipRect, pixelRect } = require('./region.cjs');
const MAX_SHOT_AREA = 2500000;
const UI = '[data-annot-ui]';

class CaptureError extends Error {
  constructor(code) { super(code); this.code = code; }
}

function captureErrorKey(error) {
  const keys = { invalid: 'captureInvalid', tooLarge: 'captureTooLarge', assets: 'captureAssets',
    protected: 'captureProtected', decode: 'captureDecode', changed: 'captureChanged',
    guestUnavailable: 'captureGuestUnavailable', guest: 'captureGuestFailed' };
  return 'error.' + (keys[error?.code] || (error?.name === 'SecurityError' ? 'captureProtected' : 'captureFailed'));
}

/** Keep layout placeholders for unrelated subtrees without reading their pixels or resources. */
function boundedSnapshot(rect) {
  const included = new Set([document.documentElement, document.body]);
  const marker = 'data-annot-layout-' + Math.random().toString(36).slice(2);
  for (const node of document.querySelectorAll('body *')) {
    if (node.closest(UI)) continue;
    const b = node.getBoundingClientRect();
    if (b.width <= 0 || b.height <= 0 || b.right <= rect.x || b.left >= rect.x + rect.width ||
        b.bottom <= rect.y || b.top >= rect.y + rect.height) continue;
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) included.add(ancestor);
  }
  const layouts = [];
  for (const parent of included) {
    parent.setAttribute(marker, String(layouts.length));
    const omitted = [];
    Array.from(parent.childNodes).forEach((node, index) => {
      if (node.nodeType !== 1 || included.has(node)) return;
      const style = getComputedStyle(node);
      let css = '';
      for (const key of ['display', 'position', 'inset', 'inset-block', 'inset-inline', 'width', 'height',
        'min-width', 'max-width', 'min-height', 'max-height', 'box-sizing', 'margin', 'padding', 'border-width',
        'border-style', 'flex', 'order', 'align-self', 'justify-self', 'grid-area', 'float', 'clear',
        'vertical-align', 'aspect-ratio', 'writing-mode', 'font-size', 'line-height', 'transform',
        'transform-origin', 'translate', 'rotate', 'scale', 'zoom']) {
        css += key + ':' + style.getPropertyValue(key) + ';';
      }
      omitted.push({ index, css });
    });
    layouts.push({ parent, omitted });
  }
  return {
    filter: (node) => node.nodeType !== 1 || included.has(node),
    restore: () => layouts.forEach(({ parent }) => parent.removeAttribute(marker)),
    fill(svg) {
      layouts.forEach(({ omitted }, id) => {
        const parent = svg.querySelector('[' + marker + '="' + id + '"]');
        if (!parent) return;
        omitted.forEach(({ index, css }) => {
          const placeholder = svg.createElementNS('http://www.w3.org/1999/xhtml', 'div');
          placeholder.style.cssText = css;
          Object.assign(placeholder.style, { visibility: 'hidden', background: 'none', mask: 'none',
            webkitMask: 'none', borderImageSource: 'none', listStyleImage: 'none', filter: 'none' });
          parent.insertBefore(placeholder, parent.childNodes[index] || null);
        });
        parent.removeAttribute(marker);
      });
    },
  };
}

async function cropDataUrl(data, rect, viewport) {
  const image = new Image();
  image.src = data;
  try { await image.decode(); } catch (_) { throw new CaptureError('decode'); }
  const crop = pixelRect(rect, viewport, { width: image.naturalWidth, height: image.naturalHeight });
  if (!crop) throw new CaptureError('invalid');
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1600 / Math.max(crop.width, crop.height));
  canvas.width = Math.max(1, Math.round(crop.width * scale));
  canvas.height = Math.max(1, Math.round(crop.height * scale));
  canvas.getContext('2d').drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

async function captureDom(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) throw new CaptureError('invalid');
  if (rect.width * rect.height > MAX_SHOT_AREA) throw new CaptureError('tooLarge');
  const ratio = Math.min(2, Math.max(0.25, 1200 / Math.max(rect.width, rect.height)));
  try { return await toPng(el, { pixelRatio: ratio, skipFonts: true, cacheBust: false, filter: (node) => !node.matches?.(UI) }); }
  catch (error) { throw new CaptureError(error?.name === 'SecurityError' ? 'protected' : 'assets'); }
}

async function captureHostRegion(rect) {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const box = clipRect(rect, viewport.width, viewport.height, 4);
  if (!box) throw new CaptureError('invalid');
  if (box.width * box.height > MAX_SHOT_AREA) throw new CaptureError('tooLarge');
  const snapshot = boundedSnapshot(box);
  // SVG serialization does not preserve scroll offsets. Mark only scrolling nodes,
  // then apply their offsets inside the detached snapshot, never to the live UI.
  const marker = 'data-annot-scroll-' + Math.random().toString(36).slice(2);
  const scrollers = [];
  const positioned = [];
  for (const node of document.querySelectorAll('*')) {
    if (!node.closest(UI) && (node.scrollTop || node.scrollLeft)) {
      node.setAttribute(marker, String(scrollers.length));
      scrollers.push({ node, x: node.scrollLeft, y: node.scrollTop, width: node.scrollWidth, height: node.scrollHeight });
    }
  }
  for (const node of document.querySelectorAll('*')) {
    if (node.closest(UI) || !scrollers.some((entry) => entry.node.contains(node))) continue;
    if (!['fixed', 'sticky'].includes(getComputedStyle(node).position)) continue;
    node.setAttribute(marker + '-position', String(positioned.length));
    positioned.push({ node, rect: node.getBoundingClientRect() });
  }
  let data;
  try {
    data = await toSvg(document.documentElement, { width: viewport.width, height: viewport.height,
      skipFonts: true, cacheBust: false, filter: snapshot.filter });
  } catch (error) {
    throw new CaptureError(error?.name === 'SecurityError' ? 'protected' : 'assets');
  } finally {
    snapshot.restore();
    scrollers.forEach(({ node }) => node.removeAttribute(marker));
    positioned.forEach(({ node }) => node.removeAttribute(marker + '-position'));
  }
  const svg = new DOMParser().parseFromString(decodeURIComponent(data.slice(data.indexOf(',') + 1)), 'image/svg+xml');
  if (svg.querySelector('parsererror')) throw new CaptureError('decode');
  snapshot.fill(svg);
  for (const [index, scroll] of scrollers.entries()) {
    const node = svg.querySelector('[' + marker + '="' + index + '"]');
    if (!node) continue;
    const inner = svg.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    for (const key of ['display', 'flexDirection', 'flexWrap', 'alignItems', 'alignContent', 'justifyContent',
      'justifyItems', 'gap', 'gridTemplateColumns', 'gridTemplateRows', 'gridAutoColumns', 'gridAutoRows',
      'gridAutoFlow', 'padding', 'writingMode']) inner.style[key] = node.style[key];
    while (node.firstChild) inner.appendChild(node.firstChild);
    Object.assign(inner.style, { position: 'relative', top: '0', left: '0', margin: '0', border: '0',
      width: scroll.width + 'px', height: scroll.height + 'px', boxSizing: 'border-box',
      overflow: 'visible', transform: `translate(${-scroll.x}px, ${-scroll.y}px)` });
    Object.assign(node.style, { display: 'block', padding: '0', paddingBlock: '0', paddingInline: '0', overflow: 'hidden' });
    node.appendChild(inner);
  }
  for (const [index, entry] of positioned.entries()) {
    const node = svg.querySelector('[' + marker + '-position="' + index + '"]');
    if (!node) continue;
    // Scrolling wrappers establish containing blocks; keep fixed/sticky content
    // at its measured viewport location and retain its original layout space.
    const placeholder = node.cloneNode(true);
    placeholder.style.visibility = 'hidden';
    placeholder.removeAttribute(marker + '-position');
    placeholder.querySelectorAll('[' + marker + '-position]').forEach((child) => child.removeAttribute(marker + '-position'));
    node.replaceWith(placeholder);
    const { x, y, width, height } = entry.rect;
    const values = { position: 'absolute', inset: `${y}px auto auto ${x}px`,
      insetBlock: `${y}px auto`, insetInline: `${x}px auto`, margin: '0', marginBlock: '0', marginInline: '0',
      width: width + 'px', inlineSize: width + 'px', height: height + 'px', blockSize: height + 'px',
      boxSizing: 'border-box', transform: 'none' };
    for (const [key, value] of Object.entries(values)) node.style.setProperty(key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()), value, 'important');
    svg.querySelector('foreignObject').firstElementChild.appendChild(node);
  }
  data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  return cropDataUrl(data, box, viewport);
}

async function captureGuest(wv, rect, expected) {
  if (!wv || typeof wv.capturePage !== 'function') throw new CaptureError('guestUnavailable');
  const prepare = `window.__dshAnnotate && window.__dshAnnotate.prepareCapture(${JSON.stringify(expected || null)})`;
  try {
    const viewport = await wv.executeJavaScript(prepare);
    const box = viewport && clipRect(rect, viewport.width, viewport.height, 2);
    if (!box) throw new CaptureError('changed');
    if (box.width * box.height > MAX_SHOT_AREA) throw new CaptureError('tooLarge');
    // capturePage rectangle units vary with guest zoom; crop the actual raster
    // against the reported CSS viewport instead of assuming DPR or host offsets.
    const image = await wv.capturePage();
    const shot = await cropDataUrl(image.toDataURL(), box, viewport);
    const valid = await wv.executeJavaScript(`window.__dshAnnotate && window.__dshAnnotate.captureValid(${JSON.stringify(viewport)})`);
    if (!valid) throw new CaptureError('changed');
    return shot;
  } catch (error) {
    if (error instanceof CaptureError) throw error;
    throw new CaptureError('guest');
  } finally {
    try { await wv.executeJavaScript('window.__dshAnnotate && window.__dshAnnotate.finishCapture()'); } catch (_) {}
  }
}

module.exports = { CaptureError, captureErrorKey, cropDataUrl, captureDom, captureHostRegion, captureGuest };
