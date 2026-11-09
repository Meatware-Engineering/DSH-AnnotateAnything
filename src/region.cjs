'use strict';

function clipRect(rect, width, height, minimum = 1) {
  if (!rect || ![rect.x, rect.y, rect.width, rect.height, width, height].every(Number.isFinite) ||
      rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return null;
  const x = Math.max(0, Math.min(width, rect.x));
  const y = Math.max(0, Math.min(height, rect.y));
  const right = Math.max(0, Math.min(width, rect.x + rect.width));
  const bottom = Math.max(0, Math.min(height, rect.y + rect.height));
  if (right - x < minimum || bottom - y < minimum) return null;
  return { x, y, width: right - x, height: bottom - y };
}

function dragRect(start, end, width, height, minimum = 4) {
  return clipRect({ x: Math.min(start.x, end.x), y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y) }, width, height, minimum);
}

function pixelRect(rect, viewport, image) {
  const box = clipRect(rect, viewport.width, viewport.height);
  if (!box || ![image.width, image.height].every(Number.isFinite) || image.width <= 0 || image.height <= 0) return null;
  const sx = image.width / viewport.width, sy = image.height / viewport.height;
  const x = Math.floor(box.x * sx), y = Math.floor(box.y * sy);
  return { x, y, width: Math.ceil((box.x + box.width) * sx) - x,
    height: Math.ceil((box.y + box.height) * sy) - y };
}

/** A click picks an element; 4 CSS pixels of movement starts a region gesture.
 * Shared by the host and serialized guest; capture keeps outside releases safe. */
function installRegionPicker(target, options) {
  let drag = null;
  const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
  const cancel = () => {
    const previous = drag;
    drag = null;
    if (previous) {
      try { previous.target.releasePointerCapture(previous.id); } catch (_) {}
      options.preview(null);
    }
    return !!previous;
  };
  const down = (event) => {
    if (options.ignore(event)) return;
    swallow(event);
    if (event.button !== 0 || event.isPrimary === false || options.blocked()) return;
    cancel();
    drag = { x: event.clientX, y: event.clientY, id: event.pointerId, target: event.target, moved: false };
    try { event.target.setPointerCapture(event.pointerId); } catch (_) {}
  };
  const move = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    swallow(event);
    if (event.buttons === 0) { cancel(); return; }
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) >= 4) drag.moved = true;
    if (!drag.moved) return;
    const bounds = options.bounds();
    options.preview(dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height, 1));
  };
  const up = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    swallow(event);
    const start = drag;
    const moved = start.moved || Math.hypot(event.clientX - start.x, event.clientY - start.y) >= 4;
    const bounds = options.bounds();
    const rect = dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height);
    cancel();
    if (moved) { if (rect) options.select(rect); }
    else options.click(start);
  };
  const lost = (event) => { if (drag && drag.id === event.pointerId) cancel(); };
  const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: lost, lostpointercapture: lost };
  Object.entries(listeners).forEach(([name, handler]) => target.addEventListener(name, handler, true));
  return { cancel, isDragging: () => !!drag?.moved, destroy() {
    cancel();
    Object.entries(listeners).forEach(([name, handler]) => target.removeEventListener(name, handler, true));
  } };
}

module.exports = { clipRect, dragRect, pixelRect, installRegionPicker };
