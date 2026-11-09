'use strict';
const { toPng, toSvg } = require('html-to-image');
const { clipRect, pixelRect } = require('./region.cjs');
const MAX_SHOT_AREA = 2500000;
const UI = '[data-annot-ui]';

async function cropDataUrl(data, rect, viewport) {
  const image = new Image();
  image.src = data;
  await image.decode();
  const crop = pixelRect(rect, viewport, { width: image.naturalWidth, height: image.naturalHeight });
  if (!crop) throw new Error('Invalid screenshot bounds');
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1600 / Math.max(crop.width, crop.height));
  canvas.width = Math.max(1, Math.round(crop.width * scale));
  canvas.height = Math.max(1, Math.round(crop.height * scale));
  canvas.getContext('2d').drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

async function captureDom(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2 || rect.width * rect.height > MAX_SHOT_AREA) return null;
  const ratio = Math.min(2, Math.max(0.25, 1200 / Math.max(rect.width, rect.height)));
  return toPng(el, { pixelRatio: ratio, skipFonts: true, cacheBust: false, filter: (node) => !node.matches?.(UI) });
}

async function captureHostRegion(rect) {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const box = clipRect(rect, viewport.width, viewport.height, 4);
  if (!box || box.width * box.height > MAX_SHOT_AREA) throw new Error('Invalid region size');
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
      skipFonts: true, cacheBust: false, filter: (node) => !node.matches?.(UI) });
  } finally {
    scrollers.forEach(({ node }) => node.removeAttribute(marker));
    positioned.forEach(({ node }) => node.removeAttribute(marker + '-position'));
  }
  const svg = new DOMParser().parseFromString(decodeURIComponent(data.slice(data.indexOf(',') + 1)), 'image/svg+xml');
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
  if (!wv || typeof wv.capturePage !== 'function') throw new Error('Guest capture unavailable');
  const prepare = `window.__dshAnnotate && window.__dshAnnotate.prepareCapture(${JSON.stringify(expected || null)})`;
  try {
    const viewport = await wv.executeJavaScript(prepare);
    const box = viewport && clipRect(rect, viewport.width, viewport.height, 2);
    if (!box || box.width * box.height > MAX_SHOT_AREA) throw new Error('Guest selection changed');
    // capturePage rectangle units vary with guest zoom; crop the actual raster
    // against the reported CSS viewport instead of assuming DPR or host offsets.
    const image = await wv.capturePage();
    const shot = await cropDataUrl(image.toDataURL(), box, viewport);
    const valid = await wv.executeJavaScript(`window.__dshAnnotate && window.__dshAnnotate.captureValid(${JSON.stringify(viewport)})`);
    if (!valid) throw new Error('Guest moved during capture');
    return shot;
  } finally {
    await wv.executeJavaScript('window.__dshAnnotate && window.__dshAnnotate.finishCapture()').catch(() => {});
  }
}

module.exports = { cropDataUrl, captureDom, captureHostRegion, captureGuest };
