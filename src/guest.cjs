'use strict';

/**
 * Scripts injected into a Browser panel guest page (<webview>) because a
 * cross-origin guest document is otherwise unreachable from the Harness page.
 * The guest owns its hover highlight and reports picks through console text.
 */
const { createRegionTools } = require('./region.cjs');

const MARK = '__DSH_ANNOTATE__';

const GUEST_INSTALL = `(function () {
  var MARK = '${MARK}';
  var tools = (${createRegionTools.toString()})();
  var installRegionPicker = tools.installRegionPicker;
  var revision = 0;
  var instance = Math.random().toString(36).slice(2);
  var capturing = false;
  function viewport() { return { width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision, instance: instance }; }
  function emit(payload) { console.log(MARK + JSON.stringify(payload)); }
  function hide() { box.style.display = 'none'; label.style.display = 'none'; }
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  var HIT = 'position:fixed;pointer-events:none;border:2px solid __ACCENT__;background:color-mix(in srgb,__ACCENT__ 16%,transparent);border-radius:3px;z-index:2147483647;display:none;box-sizing:border-box';
  var LABEL = 'position:fixed;pointer-events:none;background:__ACCENT__;color:__ON_ACCENT__;font:11px/1.5 -apple-system,system-ui,sans-serif;padding:1px 6px;border-radius:3px;z-index:2147483647;display:none;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis';
  var layer = document.createElement('div');
  layer.setAttribute('data-dsh-annotate', '1');
  layer.style.cssText = 'position:fixed;inset:0;z-index:2147483646;cursor:crosshair;background:transparent';
  var box = document.createElement('div');
  box.style.cssText = HIT;
  var label = document.createElement('div');
  label.style.cssText = LABEL;
  function clip(value, max) {
    var text = String(value == null ? '' : value).replace(/\\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }
  function describe(el) {
    var read = function (name) { try { return el.getAttribute(name); } catch (error) { return null; } };
    var text = el.innerText != null ? el.innerText : el.textContent;
    var label = clip(read('aria-label') || read('title') || read('alt') || read('placeholder') || text, 90);
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var part = String(node.tagName).toLowerCase();
      if (node.getAttribute && node.getAttribute('id')) { parts.unshift(part + '#' + node.getAttribute('id')); break; }
      var classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
      if (classes.length) part += '.' + classes.join('.');
      var parent = node.parentElement;
      if (parent) {
        var same = Array.prototype.filter.call(parent.children, function (child) { return child.tagName === node.tagName; });
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = node.parentElement;
      depth += 1;
    }
    var rect = el.getBoundingClientRect();
    return {
      tag: String(el.tagName).toLowerCase(),
      label: label,
      text: clip(text, 200),
      selector: parts.join(' > '),
      rect: { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) }
    };
  }
  function hit(x, y) {
    var list = document.elementsFromPoint(x, y);
    for (var i = 0; i < list.length; i += 1) {
      var el = list[i];
      if (el === layer || el === box || el === label) continue;
      if (el.closest && el.closest('[data-dsh-annotate]')) continue;
      return el;
    }
    return null;
  }
  function show(el) {
    if (!el) { box.style.display = 'none'; label.style.display = 'none'; return; }
    var rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) { box.style.display = 'none'; label.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = rect.left + 'px';
    box.style.top = rect.top + 'px';
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
    var info = describe(el);
    label.textContent = info.tag + (info.label ? ' · ' + clip(info.label, 48) : '');
    label.style.display = 'block';
    var below = rect.top + 20 < window.innerHeight;
    label.style.left = Math.max(2, Math.min(rect.left, window.innerWidth - 220)) + 'px';
    label.style.top = (below ? rect.top + 2 : Math.max(2, rect.top - 20)) + 'px';
  }
  var frozen = false;
  var frozenEl = null;
  var scrollFrame = 0;
  var picker;
  function reportScroll() {
    revision += 1;
    if (picker) picker.cancel();
    hide();
    if (frozen && frozenEl && frozenEl.isConnected) show(frozenEl);
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = 0;
      try { console.log(MARK + JSON.stringify({ kind: 'scroll', x: window.scrollX, y: window.scrollY, revision: revision })); } catch (error) {}
    });
  }
  window.addEventListener('scroll', reportScroll, true);
  window.addEventListener('resize', reportScroll, true);
  layer.addEventListener('mousemove', function (event) {
    if (frozen || capturing || picker.isDragging()) return;
    show(hit(event.clientX, event.clientY));
  });
  layer.addEventListener('mousedown', function (event) { event.preventDefault(); event.stopPropagation(); }, true);
  layer.addEventListener('click', function (event) { event.preventDefault(); event.stopImmediatePropagation(); }, true);
  function pickElement(point) {
    if (frozen || capturing) return;
    var el = hit(point.x, point.y);
    if (!el) return;
    frozen = true;
    frozenEl = el;
    var info = describe(el);
    info.kind = 'pick';
    info.viewport = viewport();
    info.scroll = { x: window.scrollX, y: window.scrollY };
    try { console.log(MARK + JSON.stringify(info)); } catch (error) {}
  }
  picker = installRegionPicker(layer, {
    ignore: function () { return false; },
    blocked: function () { return frozen || capturing; },
    bounds: viewport,
    click: pickElement,
    preview: function (rect) {
      hide();
      if (!rect) return;
      Object.assign(box.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    },
    select: function (rect) {
      frozen = true;
      emit({ kind: 'region', rect: rect, viewport: viewport(), scroll: { x: scrollX, y: scrollY } });
    }
  });
  function onKey(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!picker.cancel()) emit({ kind: 'escape' });
  }
  function onBlur() { picker.cancel(); }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('blur', onBlur);
  document.documentElement.appendChild(box);
  document.documentElement.appendChild(label);
  document.documentElement.appendChild(layer);
  window.__dshAnnotate = {
    freeze: function () { frozen = true; picker.cancel(); },
    prepareCapture: async function (expected) {
      var now = viewport();
      if (expected && !['width', 'height', 'x', 'y', 'revision', 'instance'].every(function (key) { return now[key] === expected[key]; })) return null;
      capturing = true; hide();
      await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
      return window.__dshAnnotate && window.__dshAnnotate.captureValid(now) ? now : null;
    },
    captureValid: function (expected) {
      var now = viewport();
      return !!expected && ['width', 'height', 'x', 'y', 'revision', 'instance'].every(function (key) { return now[key] === expected[key]; });
    },
    finishCapture: function () { capturing = false; if (!frozen) hide(); },
    resume: function () {
      frozen = false;
      picker.cancel();
      frozenEl = null;
      box.style.display = 'none';
      label.style.display = 'none';
    },
    scroll: reportScroll,
    destroy: function () {
      picker.destroy();
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', onBlur);
      try { layer.remove(); box.remove(); label.remove(); } catch (error) {}
      window.removeEventListener('scroll', reportScroll, true);
      window.removeEventListener('resize', reportScroll, true);
      window.__dshAnnotate = null;
    }
  };
  emit({ kind: 'ready', x: scrollX, y: scrollY, revision: revision });
  return true;
})()`;

const GUEST_FREEZE = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.freeze) window.__dshAnnotate.freeze();
  return true;
})()`;

const GUEST_RESUME = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.resume) window.__dshAnnotate.resume();
  return true;
})()`;

const GUEST_REMOVE = `(function () {
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  window.__dshAnnotate = null;
  return true;
})()`;

module.exports = { MARK: MARK, GUEST_INSTALL: GUEST_INSTALL, GUEST_REMOVE: GUEST_REMOVE, GUEST_FREEZE: GUEST_FREEZE, GUEST_RESUME: GUEST_RESUME };
