'use strict';

const React = require('react');
const { CaptureError, captureErrorKey, captureDom, captureHostRegion, captureGuest } = require('./capture.cjs');
const { clipRect, installRegionPicker } = require('./region.cjs');
const { describeElement, dataUrlToBytes, formatAnnotations, clip } = require('./lib.cjs');
const { MARK, GUEST_INSTALL, GUEST_REMOVE, GUEST_FREEZE, GUEST_RESUME } = require('./guest.cjs');

const NS = 'annotateAnything';
const UI = '[data-annot-ui]';

const CSS = `
.dsh-annot-trigger{position:relative;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:none}
.dsh-annot-trigger__badge{position:absolute;top:-2px;right:-3px;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:600 9px/13px system-ui,sans-serif;text-align:center}
.dsh-annot-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-annot-trigger--active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent);color:var(--dsw-alias-brand-primary)}
.dsh-annot-layer{position:fixed;inset:0;z-index:9000;pointer-events:none}
.dsh-annot-bar{position:fixed;bottom:14px;top:auto;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:6px 8px 6px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px rgba(0,0,0,.18);font:12px/1.4 system-ui,-apple-system,sans-serif;pointer-events:auto;max-width:min(760px,92vw)}
.dsh-annot-bar__hint{color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-annot-bar__count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font-weight:600}
.dsh-annot-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font:12px/1.3 inherit;cursor:pointer;white-space:nowrap}
.dsh-annot-btn:hover:enabled{background:var(--dsw-alias-bg-layer-2)}
.dsh-annot-btn:disabled{opacity:.5;cursor:default}
.dsh-annot-btn--primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff)}
.dsh-annot-btn--primary:hover:enabled{filter:brightness(1.06)}
.dsh-annot-btn--danger{color:var(--dsw-alias-state-error-primary)}
.dsh-annot-hover{position:fixed;pointer-events:none;border:2px solid var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);border-radius:3px;box-sizing:border-box}
.dsh-annot-hover__tag{position:fixed;pointer-events:none;max-width:60vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 6px;border-radius:4px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:11px/1.5 system-ui,-apple-system,sans-serif}
.dsh-annot-outline{position:fixed;pointer-events:none;border:2px dashed var(--dsw-alias-brand-primary);border-radius:3px;opacity:.85;box-sizing:border-box}
.dsh-annot-pin{position:fixed;pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:600 12px/1 system-ui,-apple-system,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.dsh-annot-card{position:fixed;width:300px;pointer-events:auto;padding:10px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px rgba(0,0,0,.22);font:12px/1.45 system-ui,-apple-system,sans-serif}
.dsh-annot-card__title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__input{width:100%;box-sizing:border-box;resize:vertical;min-height:64px;padding:6px 8px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-annot-card__input:focus{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:0}
.dsh-annot-card__where{color:var(--dsw-alias-label-secondary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__rows{display:flex;gap:6px;justify-content:flex-end}
.dsh-annot-error{position:fixed;bottom:62px;left:50%;transform:translateX(-50%);pointer-events:none;max-width:80vw;padding:6px 12px;border-radius:8px;background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground,#fff);font:12px/1.4 system-ui,-apple-system,sans-serif}
`;

const ICON = React.createElement(
  'svg',
  { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true, focusable: false },
  React.createElement('path', {
    d: 'M2.5 2.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3 2.5V11.5H2.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinejoin: 'round',
  }),
  React.createElement('circle', { cx: 8, cy: 6.5, r: 1.6, fill: 'currentColor' }),
);

function createStore() {
  let state = { active: false, sessionId: undefined, count: 0 };
  const listeners = new Set();
  return {
    get: () => state,
    set(patch) {
      state = Object.assign({}, state, patch);
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function boxOf(rect) {
  if (!rect) return null;
  const x = rect.x !== undefined ? rect.x : rect.left;
  const y = rect.y !== undefined ? rect.y : rect.top;
  const width = rect.width;
  const height = rect.height;
  if (![x, y, width, height].every(Number.isFinite) || width < 1 || height < 1) return null;
  return { x: x, y: y, width: width, height: height };
}

function Trigger({ props, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  React.useEffect(() => {
    store.set({ sessionId: props && props.sessionId });
  }, [props && props.sessionId]);
  return React.createElement(
    'button',
    {
      type: 'button',
      'data-annot-ui': 'trigger',
      className: 'dsh-annot-trigger' + (state.active ? ' dsh-annot-trigger--active' : ''),
      title: state.count > 0 ? t('trigger.titleCount', { count: state.count }) : t('trigger.title'),
      'aria-label': t('trigger.title'),
      'aria-pressed': state.active,
      onClick: () => store.set({ active: !state.active }),
    },
    ICON,
    state.count > 0 && !state.active ? React.createElement('span', { className: 'dsh-annot-trigger__badge' }, String(state.count)) : null,
  );
}

function Overlay({ ctx, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  const [hover, setHover] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [draft, setDraftState] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [, setTick] = React.useState(0);

  const draftRef = React.useRef(null);
  const itemsRef = React.useRef(items);
  const scrollRef = React.useRef(new Map());
  const guestsRef = React.useRef([]);
  const busyRef = React.useRef(busy);
  busyRef.current = busy;
  const regionPickerRef = React.useRef(null);
  const setDraft = (value) => { draftRef.current = value; setDraftState(value); };
  draftRef.current = draft;
  itemsRef.current = items;

  React.useEffect(() => {
    store.set({ count: items.length });
  }, [items.length]);

  React.useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(''), 8000);
    return () => clearTimeout(timer);
  }, [error]);

  const isActive = state.active;

  const pickAt = (x, y) => {
    const list = document.elementsFromPoint(x, y);
    for (const el of list) {
      if (el instanceof Element && el.closest(UI)) continue;
      return el;
    }
    return null;
  };

  const guestScroll = (wv) => scrollRef.current.get(wv) || { x: 0, y: 0 };

  /** Guest document coordinates -> window coordinates for the current scroll offset. */
  const guestViewportRect = (wv, docRect, viewport) => {
    const outer = wv.getBoundingClientRect();
    const scroll = guestScroll(wv);
    const sx = viewport ? outer.width / viewport.width : 1;
    const sy = viewport ? outer.height / viewport.height : 1;
    return {
      x: outer.left + (docRect.x - scroll.x) * sx,
      y: outer.top + (docRect.y - scroll.y) * sy,
      width: docRect.width * sx,
      height: docRect.height * sy,
    };
  };

  /** Guest viewport coordinates reported live by the guest (inner scrollers included). */
  const guestLiveRect = (wv, rect, viewport) => {
    const outer = wv.getBoundingClientRect();
    const sx = viewport && viewport.width > 0 ? outer.width / viewport.width : 1;
    const sy = viewport && viewport.height > 0 ? outer.height / viewport.height : 1;
    return { x: outer.left + rect.x * sx, y: outer.top + rect.y * sy, width: rect.width * sx, height: rect.height * sy };
  };

  const scrollChainOf = (el) => {
    const chain = [];
    const root = document.scrollingElement || document.documentElement;
    for (let node = el; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) {
        chain.push({ el: node, top: node.scrollTop, left: node.scrollLeft });
      }
    }
    if (!chain.some((entry) => entry.el === root)) chain.push({ el: root, top: root.scrollTop, left: root.scrollLeft });
    return chain;
  };

  /** A region follows the scroll offsets captured under it, whatever element it covers. */
  const regionRectOf = (value) => {
    if (!value || value.kind !== 'region' || !value.rect) return null;
    const chain = value.scrollChain;
    if (chain) {
      let dx = 0;
      let dy = 0;
      let intact = true;
      for (const entry of chain) {
        if (!entry.el.isConnected) { intact = false; break; }
        dx -= entry.el.scrollLeft - entry.left;
        dy -= entry.el.scrollTop - entry.top;
      }
      if (intact) return { x: value.rect.x + dx, y: value.rect.y + dy, width: value.rect.width, height: value.rect.height };
    }
    const anchor = value.anchorEl;
    const offset = value.anchorOffset;
    if (anchor && anchor.isConnected && offset) {
      const bounds = anchor.getBoundingClientRect();
      return { x: bounds.left + offset.dx, y: bounds.top + offset.dy, width: value.rect.width, height: value.rect.height };
    }
    return value.rect;
  };

  const itemRect = (item) => {
    if (item.kind === 'region' && !item.wv) return regionRectOf(item);
    if (item.wv && item.liveRect) return guestLiveRect(item.wv, item.liveRect, item.guestViewport);
    if (item.wv && item.docRect) return guestViewportRect(item.wv, item.docRect, item.guestViewport);
    if (item.wv && item.guestRect) {
      const outer = item.wv.getBoundingClientRect();
      return { x: outer.left + item.guestRect.x, y: outer.top + item.guestRect.y, width: item.guestRect.width, height: item.guestRect.height };
    }
    if (item.el && item.el.isConnected) {
      const rect = item.el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    }
    return item.rect || null;
  };

  const draftRectOf = (value) => {
    if (!value) return null;
    if (value.kind === 'region' && !value.wv) return regionRectOf(value);
    if (value.wv && value.liveRect) return guestLiveRect(value.wv, value.liveRect, value.guestViewport);
    if (value.wv && value.docRect) return guestViewportRect(value.wv, value.docRect, value.guestViewport);
    if (value.el && value.el.isConnected) {
      const rect = value.el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    }
    return value.rect || null;
  };

  /** Pull guest geometry so frames follow the page even when messages are lost. */
  const applyGuestGeometry = (wv, list) => {
    const byId = new Map(list.map((entry) => [entry.id, entry.rect]));
    setItems((prev) => {
      let changed = false;
      const next = prev.map((entry) => {
        if (entry.wv !== wv || !entry.guestId) return entry;
        const rect = byId.get(entry.guestId);
        const current = entry.liveRect;
        if (!rect || (current && current.x === rect.x && current.y === rect.y && current.width === rect.width && current.height === rect.height)) return entry;
        changed = true;
        return Object.assign({}, entry, { liveRect: rect });
      });
      return changed ? next : prev;
    });
    const draft = draftRef.current;
    if (draft && draft.wv === wv && draft.guestId) {
      const rect = byId.get(draft.guestId);
      if (rect && (!draft.liveRect || draft.liveRect.x !== rect.x || draft.liveRect.y !== rect.y || draft.liveRect.width !== rect.width || draft.liveRect.height !== rect.height)) {
        setDraft(Object.assign({}, draft, { liveRect: rect }));
      }
    }
  };

  const signalGuests = (code) => {
    for (const pair of guestsRef.current) {
      try {
        const pending = pair[0].executeJavaScript(code);
        if (pending && typeof pending.catch === 'function') pending.catch(() => {});
      } catch (_error) {
        /* guest may already be gone */
      }
    }
  };

  const capture = async (item) => {
    let shot = null;
    try {
      shot = item.wv ? await captureGuest(item.wv, item.guestRect, item.guestViewport) : await captureDom(item.el);
    } catch (failure) {
      setError(t(captureErrorKey(failure)));
    }
    if (!shot) return;
    setItems((prev) => prev.map((entry) => (entry.id === item.id ? Object.assign({}, entry, { shot: shot }) : entry)));
  };

  const openDraft = (payload) => {
    setError('');
    setDraft(payload);
  };

  const openRegion = (rect, wv, viewport, guestId) => {
    if (draftRef.current || busyRef.current) return;
    const anchor = wv ? null : pickAt(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const anchorRect = anchor ? anchor.getBoundingClientRect() : null;
    const current = {
      id: 'a' + Math.random().toString(36).slice(2), kind: 'region',
      desc: { label: t('region.label'), rect: rect, surface: wv ? 'browser' : 'harness' },
      rect: wv ? null : rect, wv: wv || null, guestRect: wv ? rect : null, guestId: guestId || null,
      liveRect: wv ? rect : null,
      anchorEl: anchorRect ? anchor : null,
      anchorOffset: anchorRect ? { dx: rect.x - anchorRect.left, dy: rect.y - anchorRect.top } : null,
      scrollChain: anchorRect ? scrollChainOf(anchor) : null,
      guestViewport: viewport, comment: '', shot: null, capturePending: true,
      docRect: wv ? { ...rect, x: rect.x + viewport.x, y: rect.y + viewport.y } : null,
    };
    openDraft(current);
    setHover(null);
    const pending = wv ? captureGuest(wv, rect, viewport) : captureHostRegion(rect);
    pending.then((shot) => {
      if (draftRef.current?.id !== current.id || !store.get().active) return;
      if (!shot) throw new CaptureError('changed');
      setDraft({ ...draftRef.current, shot, capturePending: false });
    }).catch((failure) => {
      if (draftRef.current?.id !== current.id) return;
      setDraft({ ...draftRef.current, capturePending: false });
      setError(t(captureErrorKey(failure)));
    });
  };

  const openGuestPick = (wv, payload) => {
    if (draftRef.current) return;
    const scroll = payload.scroll || { x: 0, y: 0 };
    scrollRef.current.set(wv, scroll);
    const docRect = {
      x: payload.rect.x + scroll.x,
      y: payload.rect.y + scroll.y,
      width: payload.rect.width,
      height: payload.rect.height,
    };
    openDraft({
      id: 'a' + Math.random().toString(36).slice(2),
      desc: { tag: payload.tag, label: payload.label, text: payload.text, selector: payload.selector, rect: payload.rect },
      el: null,
      wv: wv,
      guestId: payload.id,
      liveRect: payload.rect,
      guestRect: payload.rect,
      guestViewport: payload.viewport,
      docRect: docRect,
      rect: null,
      comment: '',
      shot: null,
      editing: false,
    });
  };

  const saveDraft = () => {
    const current = draftRef.current;
    if (!current || current.capturePending || (current.kind === 'region' && !current.shot)) return;
    const exists = itemsRef.current.some((entry) => entry.id === current.id);
    if (exists) {
      setItems((prev) => prev.map((entry) => (entry.id === current.id ? Object.assign({}, entry, { comment: current.comment }) : entry)));
    } else {
      const item = { ...current, editing: false };
      setItems(itemsRef.current.concat([item]));
      if (!item.shot) capture(item).catch(() => {});
    }
    setDraft(null);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
    setDraft(null);
  };

  const stop = (event) => {
    if (event.target instanceof Element && event.target.closest(UI)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  React.useEffect(() => {
    if (!isActive) return undefined;
    const onMove = (event) => {
      if (regionPickerRef.current?.isDragging() || draftRef.current || busyRef.current) return;
      if (event.target instanceof Element && event.target.closest(UI)) return;
      const el = pickAt(event.clientX, event.clientY);
      if (!el) {
        setHover(null);
        return;
      }
      if (String(el.tagName).toLowerCase() === 'webview') {
        setHover(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHover(null);
        return;
      }
      setHover({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, desc: describeElement(el) });
    };
    const pickElement = ({ x, y }) => {
      if (draftRef.current || busyRef.current) return;
      const el = pickAt(x, y);
      if (!el) return;
      if (String(el.tagName).toLowerCase() === 'webview') {
        setError(t('error.guestHint'));
        return;
      }
      openDraft({
        id: 'a' + Math.random().toString(36).slice(2),
        desc: describeElement(el),
        el: el,
        wv: null,
        guestRect: null,
        rect: null,
        comment: '',
        shot: null,
        editing: false,
      });
    };
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (regionPickerRef.current?.cancel()) return;
      const current = draftRef.current;
      if (current) {
        // Escape closes the card, never the collected annotations: a new draft is
        // kept (empty comment can be edited from its pin), an edit is discarded.
        if (current.editing || current.capturePending) setDraft(null);
        else saveDraft();
        return;
      }
      store.set({ active: false });
    };
    const invalidate = () => {
      regionPickerRef.current?.cancel();
      if (draftRef.current?.capturePending) setDraft(null);
      setHover(null);
      setTick((value) => value + 1);
    };
    const onScroll = (event) => {
      if (event.target instanceof Element && event.target.closest(UI)) return;
      invalidate();
    };
    const picker = installRegionPicker(document, {
      ignore: (event) => event.target instanceof Element && !!event.target.closest(UI),
      blocked: () => !!draftRef.current || busyRef.current,
      bounds: () => ({ width: innerWidth, height: innerHeight }),
      preview: setHover,
      click: pickElement,
      select: (rect) => {
        // Cross-process surfaces must be selected inside their own viewport.
        const overlapsGuest = Array.from(document.querySelectorAll('webview')).some((wv) => {
          const b = wv.getBoundingClientRect();
          return rect.x < b.right && rect.x + rect.width > b.left && rect.y < b.bottom && rect.y + rect.height > b.top;
        });
        if (overlapsGuest) { setError(t('error.guestHint')); return; }
        openRegion(rect);
      },
    });
    regionPickerRef.current = picker;
    const onBlur = () => picker.cancel();
    window.addEventListener('blur', onBlur);

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mousedown', stop, true);
    document.addEventListener('pointerdown', stop, true);
    document.addEventListener('click', stop, true);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll, true);

    let disposed = false;
    const guests = [];
    const watched = new WeakSet();
    const detach = (wv) => {
      const index = guests.findIndex((pair) => pair[0] === wv);
      if (index === -1) return;
      try { guests[index][0].removeEventListener('console-message', guests[index][1]); } catch (_error) { /* gone */ }
      try { wv.removeEventListener('did-start-navigation', invalidate); } catch (_error) { /* gone */ }
      guests.splice(index, 1);
      guestsRef.current = guests;
    };
    const install = () => {
      if (disposed) return;
      for (const wv of Array.from(document.querySelectorAll('webview'))) {
        if (guests.some((pair) => pair[0] === wv)) continue;
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        // A navigating or freshly created webview loses the injected script:
        // re-attach when the document settles (the poll also retries).
        if (!watched.has(wv)) {
          watched.add(wv);
          wv.addEventListener('did-stop-loading', () => { detach(wv); install(); });
        }
        try {
          const pending = wv.executeJavaScript(guestInstallScript());
          if (pending && typeof pending.catch === 'function') pending.catch(() => {});
        } catch (_error) {
          /* guest annotation stays unavailable for this tab */
        }
        const onMessage = (...args) => {
          const message = args
            .map((value) => (typeof value === 'string' ? value : value && value.message))
            .find((value) => typeof value === 'string' && value.indexOf(MARK) === 0);
          if (!message) return;
          try {
            const payload = JSON.parse(message.slice(MARK.length));
            if (payload?.kind === 'escape') { onKey({ key: 'Escape', preventDefault() {}, stopImmediatePropagation() {} }); return; }
            if (payload && ['scroll', 'ready'].includes(payload.kind)) {
              if (payload.kind === 'scroll') invalidate();
              scrollRef.current.set(wv, { x: Number(payload.x) || 0, y: Number(payload.y) || 0 });
              setTick((value) => value + 1);
              return;
            }
            if (payload && payload.kind === 'move') {
              const id = typeof payload.id === 'string' ? payload.id : '';
              const rect = payload.rect;
              const viewport = payload.viewport;
              if (!id || !rect || !viewport) return;
              const next = { id: id, rect: rect, viewport: viewport };
              setItems((prev) => (prev.some((entry) => entry.guestId === id)
                ? prev.map((entry) => (entry.guestId === id ? Object.assign({}, entry, { liveRect: next.rect, guestViewport: next.viewport }) : entry))
                : prev));
              if (draftRef.current && draftRef.current.guestId === id) {
                setDraft(Object.assign({}, draftRef.current, { liveRect: next.rect, guestViewport: next.viewport }));
              }
              return;
            }
            if (!payload || !['pick', 'region'].includes(payload.kind)) return;
            const viewport = payload.viewport;
            if (!viewport || typeof viewport.instance !== 'string' || !['width', 'height', 'x', 'y', 'revision'].every((key) => Number.isFinite(viewport[key]))) return;
            const rect = clipRect(payload.rect, viewport.width, viewport.height, payload.kind === 'region' ? 4 : 2);
            if (!rect) return;
            scrollRef.current.set(wv, { x: viewport.x, y: viewport.y });
            if (payload.kind === 'region') { openRegion(rect, wv, viewport, payload.id); return; }
            openGuestPick(wv, {
              tag: clip(payload.tag, 40),
              label: clip(payload.label, 90),
              text: clip(payload.text, 200),
              selector: clip(payload.selector, 300),
              rect: rect,
              scroll: { x: viewport.x, y: viewport.y },
              viewport: viewport,
            });
          } catch (_error) {
            /* ignore malformed guest payloads */
          }
        };
        wv.addEventListener('console-message', onMessage);
        wv.addEventListener('did-start-navigation', invalidate);
        guests.push([wv, onMessage]);
      }
      guestsRef.current = guests;
    };
    const uninstall = () => {
      disposed = true;
      for (const pair of guests) {
        try {
          pair[0].removeEventListener('console-message', pair[1]);
          pair[0].removeEventListener('did-start-navigation', invalidate);
          const pending = pair[0].executeJavaScript(GUEST_REMOVE);
          if (pending && typeof pending.catch === 'function') pending.catch(() => {});
        } catch (_error) {
          /* guest may already be gone */
        }
      }
      guests.length = 0;
      guestsRef.current = [];
    };
    install();
    // The guest pushes moves, but the host also pulls geometry: message delivery
    // and animation frames are not guaranteed inside a sandboxed webview.
    const poll = setInterval(() => {
      install();
      for (const pair of guests) {
        const wv = pair[0];
        if (wv.__annotPolling) continue;
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        wv.__annotPolling = true;
        try {
          const pending = wv.executeJavaScript('window.__dshAnnotate && window.__dshAnnotate.geometry ? window.__dshAnnotate.geometry() : null');
          Promise.resolve(pending)
            .then((list) => { if (Array.isArray(list) && list.length) applyGuestGeometry(wv, list); })
            .catch(() => {})
            .finally(() => { wv.__annotPolling = false; });
        } catch (_error) {
          wv.__annotPolling = false;
        }
      }
    }, 120);
    return () => {
      clearInterval(poll);
      picker.destroy();
      regionPickerRef.current = null;
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mousedown', stop, true);
      document.removeEventListener('pointerdown', stop, true);
      document.removeEventListener('click', stop, true);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      uninstall();
    };
  }, [isActive, store, t]);

  React.useEffect(() => {
    // Leaving the mode hides its card but keeps the annotations already collected.
    if (!isActive) { setDraft(null); setHover(null); }
  }, [isActive]);

  // Freeze the guest highlight while a comment card is open so the marked
  // region stops following the pointer until the comment is settled.
  React.useEffect(() => {
    if (!isActive) return;
    signalGuests(draft ? GUEST_FREEZE : GUEST_RESUME);
  }, [draft, isActive]);

  const send = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const conversation = ctx.get('conversation');
      const sessions = ctx.get('sessions');
      const sessionId = state.sessionId;
      const session = sessionId && sessions ? (sessions.binding(sessionId) || {}).session : undefined;
      if (!conversation || !session) throw new Error(t('error.noSession'));

      const resolved = [];
      for (let index = 0; index < itemsRef.current.length; index += 1) {
        const item = itemsRef.current[index];
        let shot = item.shot;
        let captureFailure;
        if (!shot && item.kind !== 'region') {
          try {
            shot = item.wv ? await captureGuest(item.wv, item.guestRect, item.guestViewport) : await captureDom(item.el);
          } catch (failure) {
            captureFailure = failure;
            shot = null;
          }
        }
        resolved.push(Object.assign({}, item, { shot: shot, captureFailure }));
      }

      const failed = resolved.find((item) => !item.shot);
      if (failed) { setError(t(captureErrorKey(failed.captureFailure))); return; }

      const files = [];
      resolved.forEach((item, index) => {
        if (!item.shot) return;
        const decoded = dataUrlToBytes(item.shot);
        files.push(new File([decoded.bytes], 'annotation-' + (index + 1) + '.png', { type: decoded.mediaType }));
      });
      // Typed composer text is part of the message; send it together and clear it
      // only after the Host accepted the prompt.
      let shell = null;
      try { shell = conversation.input && sessionId ? conversation.input.shell(sessionId) : null; } catch (_error) { shell = null; }
      const typed = shell && shell.snapshot ? String(shell.snapshot.draft || '').trim() : '';
      const annotations = formatAnnotations(resolved, t);
      const text = typed ? typed + '\n\n' + annotations : annotations;
      if (typeof conversation.createDrafts !== 'function' || typeof conversation.sendSession !== 'function') {
        throw new Error(t('error.unsupportedApi'));
      }
      const drafts = conversation.createDrafts(sessionId, files, false) || [];
      const result = await conversation.sendSession(session, text, drafts.map((entry) => entry.id), 'queue');
      if (!result || result.kind !== 'success') throw new Error(t('error.sendFailed'));
      if (typed && shell) { try { shell.setDraft(''); } catch (_error) { /* the draft stays if the composer refuses */ } }
      setItems([]);
      store.set({ active: false });
    } catch (failure) {
      setError(String((failure && failure.message) || failure));
    } finally {
      setBusy(false);
    }
  };

  if (!isActive) return null;

  const children = [];
  children.push(
    React.createElement(
      'div',
      { key: 'bar', 'data-annot-ui': 'bar', className: 'dsh-annot-bar' },
      React.createElement('span', { className: 'dsh-annot-bar__hint' }, t(draft ? (draft.capturePending ? 'bar.capturing' : 'bar.hintDraft') : 'bar.hint')),
      React.createElement('span', { className: 'dsh-annot-bar__count' }, String(items.length)),
      ...items.flatMap((item, index) => item.kind === 'region' && boxOf(itemRect(item)) === null ? [
        React.createElement('button', { key: item.id, className: 'dsh-annot-btn', disabled: busy || !!draft,
          title: item.comment || t('pin.empty'), 'aria-label': t('pin.edit', { index: index + 1 }),
          onClick: () => openDraft({ ...item, editing: true }) }, String(index + 1)),
      ] : []),
      items.length > 0 ? React.createElement('button', { key: 'clear', className: 'dsh-annot-btn dsh-annot-btn--danger', onClick: () => setItems([]) }, t('bar.clear')) : null,
      React.createElement('button', { key: 'send', className: 'dsh-annot-btn dsh-annot-btn--primary', disabled: items.length === 0 || busy || !!draft, onClick: send }, busy ? t('bar.sending') : t('bar.send', { count: items.length })),
      React.createElement('button', { key: 'close', className: 'dsh-annot-btn', onClick: () => { setDraft(null); store.set({ active: false }); } }, t('bar.close')),
    ),
  );

  const frozen = draft && !(draft.wv && draft.kind !== 'region') ? boxOf(draftRectOf(draft)) : null;
  if (draft && frozen) {
    const label = clip((draft.desc && (draft.desc.label || draft.desc.tag)) || '', 60);
    children.push(React.createElement('div', { key: 'frozen', className: 'dsh-annot-hover', style: { left: frozen.x, top: frozen.y, width: frozen.width, height: frozen.height } }));
    children.push(
      React.createElement(
        'div',
        { key: 'frozentag', className: 'dsh-annot-hover__tag', style: { left: Math.max(4, frozen.x), top: frozen.y + 2 < 24 ? frozen.y + 2 : frozen.y - 18 } },
        ((draft.desc && draft.desc.tag) || '') + (label ? ' · ' + label : ''),
      ),
    );
  }

  if (hover && !draft) {
    const label = clip((hover.desc && (hover.desc.label || hover.desc.tag)) || '', 60);
    children.push(React.createElement('div', { key: 'hover', className: 'dsh-annot-hover', style: { left: hover.x, top: hover.y, width: hover.width, height: hover.height } }));
    children.push(
      React.createElement(
        'div',
        { key: 'hovertag', className: 'dsh-annot-hover__tag', style: { left: Math.max(4, hover.x), top: hover.y + 2 < 24 ? hover.y + 2 : hover.y - 18 } },
        (hover.desc ? hover.desc.tag : '') + (label ? ' · ' + label : ''),
      ),
    );
  }

  items.forEach((item, index) => {
    const rect = boxOf(itemRect(item));
    if (!rect) return;
    children.push(
      React.createElement('div', {
        key: 'outline-' + item.id,
        className: 'dsh-annot-outline',
        style: { left: rect.x, top: rect.y, width: rect.width, height: rect.height },
      }),
    );
    children.push(
      React.createElement(
        'button',
        {
          key: 'pin-' + item.id,
          'data-annot-ui': 'pin',
          className: 'dsh-annot-pin',
          style: { left: Math.max(0, rect.x - 11), top: Math.max(0, rect.y - 11) },
          title: item.comment || t('pin.empty'),
          disabled: busy,
          onClick: () => openDraft(Object.assign({}, item, { editing: true })),
        },
        String(index + 1),
      ),
    );
  });

  if (draft) {
    const rect = boxOf(draftRectOf(draft)) || { x: 40, y: 60, width: 0, height: 0 };
    const width = 300;
    const left = Math.max(8, Math.min(rect.x, (window.innerWidth || 1200) - width - 8));
    const below = rect.y + rect.height + 8;
    const top = below + 210 > (window.innerHeight || 800) ? Math.max(8, rect.y - 210) : below;
    children.push(
      React.createElement(
        'div',
        { key: 'card', 'data-annot-ui': 'card', className: 'dsh-annot-card', style: { left: left, top: top } },
        React.createElement('div', { className: 'dsh-annot-card__title' }, clip((draft.desc && (draft.desc.label || draft.desc.tag)) || '', 70)),
        React.createElement('textarea', {
          className: 'dsh-annot-card__input',
          autoFocus: true,
          rows: 3,
          placeholder: t('card.placeholder'),
          value: draft.comment,
          onChange: (event) => setDraft(Object.assign({}, draftRef.current, { comment: event.target.value })),
        }),
        React.createElement('div', { className: 'dsh-annot-card__where' }, draft.kind === 'region'
          ? t('prompt.region', { surface: draft.desc.surface, ...draft.desc.rect }) : (draft.desc && draft.desc.selector) || ''),
        React.createElement(
          'div',
          { className: 'dsh-annot-card__rows' },
          React.createElement('button', { key: 'cancel', className: 'dsh-annot-btn', onClick: () => setDraft(null) }, t('card.cancel')),
          draft.editing
            ? React.createElement('button', { key: 'delete', className: 'dsh-annot-btn dsh-annot-btn--danger', onClick: () => removeItem(draft.id) }, t('card.delete'))
            : null,
          React.createElement('button', { key: 'save', className: 'dsh-annot-btn dsh-annot-btn--primary', disabled: !!draft.capturePending || (draft.kind === 'region' && !draft.shot), onClick: saveDraft }, t('card.save')),
        ),
      ),
    );
  }

  if (error) children.push(React.createElement('div', { key: 'error', 'data-annot-ui': 'error', className: 'dsh-annot-error' }, error));

  return React.createElement('div', { 'data-annot-ui': 'layer', className: 'dsh-annot-layer' }, children);
}

/** The guest document cannot read Harness theme tokens, so the accent is passed in. */
function guestInstallScript() {
  const root = getComputedStyle(document.documentElement);
  const read = (name, fallback) => (root.getPropertyValue(name) || '').trim() || fallback;
  const accent = read('--dsw-alias-button-primary-fill', read('--dsw-alias-brand-primary', '#3b82f6'));
  const onAccent = read('--dsw-alias-label-primary-foreground', '#fff');
  return GUEST_INSTALL.split('__ACCENT__').join(accent).split('__ON_ACCENT__').join(onAccent);
}

function apply(ctx) {
  ctx.effect(() => {
    if (typeof document === 'undefined') return undefined;
    const marker = 'dsh-annotate-anything/client.css';
    if (document.querySelector('style[data-plugin-css="' + marker + '"]') === null) {
      const style = document.createElement('style');
      style.dataset.plugin = 'dsh-annotate-anything';
      style.dataset.pluginCss = marker;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.querySelector('style[data-plugin-css="' + marker + '"]');
      if (style) style.remove();
    };
  }, 'annotate-anything: styles');

  ctx.effect(() => ctx.locale.register(NS, { en: DICT_EN, ru: DICT_RU }), 'annotate-anything: dictionaries');
  const t = ctx.locale.bind(NS);
  const store = createStore();

  ctx.slots.inject('conversation.input.left', () =>
    ctx.slots.register(
      { name: 'conversation.input.left', id: 'annotate-anything-trigger', order: 95, locale: NS, label: () => t('trigger.title') },
      (props) => React.createElement(Trigger, { props: props, store: store, t: t }),
    ),
  );

  ctx.slots.inject('shell.overlay', () =>
    ctx.slots.register({ name: 'shell.overlay', id: 'annotate-anything-overlay', order: 400 }, () =>
      React.createElement(Overlay, { ctx: ctx, store: store, t: t }),
    ),
  );
}

const DICT_EN = {
  'trigger.title': 'Annotate',
  'trigger.titleCount': 'Annotate — {count} kept',
  'bar.hint': 'Click an element or drag a region',
  'region.label': 'Selected region',
  'bar.capturing': 'Capturing…',
  'prompt.region': '   {surface} region (CSS px): x={x}, y={y}, width={width}, height={height}',
  'bar.hintDraft': 'Describe the annotation',
  'bar.send': 'Send {count}',
  'bar.clear': 'Clear',
  'bar.sending': 'Sending…',
  'bar.close': 'Close',
  'card.placeholder': 'What should change here?',
  'card.save': 'Add',
  'card.cancel': 'Cancel',
  'card.delete': 'Delete',
  'pin.empty': 'No comment',
  'pin.edit': 'Edit annotation {index}',
  'error.noSession': 'Open a chat before sending annotations',
  'error.sendFailed': 'The annotations were not sent',
  'error.unsupportedApi': 'This Harness version does not support sending image drafts. Update Harness before sending.',
  'error.captureFailed': 'The screenshot could not be rendered. Select the content again.',
  'error.captureInvalid': 'The selection is outside the visible page or is too small. Select it again.',
  'error.captureTooLarge': 'The selection exceeds 2.5 million CSS pixels. Select a smaller area.',
  'error.captureAssets': 'An image or style in this selection could not be rendered. Check that the page resources have loaded.',
  'error.captureProtected': 'This selection contains protected or cross-origin canvas/video pixels that DOM capture cannot read.',
  'error.captureDecode': 'The browser could not decode the screenshot. Some page content may be unsupported.',
  'error.captureChanged': 'The page moved, resized or navigated during capture. Select the area again.',
  'error.captureGuestUnavailable': 'This Browser tab does not expose screenshot capture. Reopen annotation mode or update Harness.',
  'error.captureGuestFailed': 'The Browser tab could not capture its viewport. Check that it is still open.',
  'error.guestHint': 'Click inside the page content, not on the tab frame',
  'prompt.head': 'Annotations from the app UI ({count}):',
  'prompt.item': '{index}. {label} — {comment}',
  'prompt.where': '   element: {selector}',
  'meta.title': 'Annotate anything',
  'meta.description': 'Point at any part of the interface, comment on it, and send annotated screenshots to the chat.',
};

const DICT_RU = {
  'trigger.title': 'Аннотировать',
  'trigger.titleCount': 'Аннотировать — сохранено {count}',
  'bar.hint': 'Нажмите на элемент или выделите область перетаскиванием',
  'region.label': 'Выделенная область',
  'bar.capturing': 'Снимок…',
  'prompt.region': '   Область {surface} (CSS px): x={x}, y={y}, ширина={width}, высота={height}',
  'bar.hintDraft': 'Опишите, что здесь не так',
  'bar.send': 'Отправить ({count})',
  'bar.clear': 'Очистить',
  'bar.sending': 'Отправка…',
  'bar.close': 'Закрыть',
  'card.placeholder': 'Что здесь поправить?',
  'card.save': 'Добавить',
  'card.cancel': 'Отмена',
  'card.delete': 'Удалить',
  'pin.empty': 'Без комментария',
  'pin.edit': 'Изменить аннотацию {index}',
  'error.noSession': 'Сначала откройте чат, чтобы отправить аннотации',
  'error.sendFailed': 'Аннотации не отправились',
  'error.unsupportedApi': 'Эта версия Harness не поддерживает отправку изображений через drafts. Обновите Harness.',
  'error.captureFailed': 'Не удалось отрисовать скриншот. Выделите содержимое заново.',
  'error.captureInvalid': 'Выделение вне видимой страницы или слишком мало. Выделите область заново.',
  'error.captureTooLarge': 'Выделение превышает 2,5 миллиона CSS-пикселей. Выберите меньшую область.',
  'error.captureAssets': 'Не удалось отрисовать изображение или стиль в выделении. Проверьте загрузку ресурсов страницы.',
  'error.captureProtected': 'Выделение содержит защищённые пиксели canvas/видео, которые DOM-захват не может прочитать.',
  'error.captureDecode': 'Браузер не смог декодировать скриншот. Часть содержимого страницы может не поддерживаться.',
  'error.captureChanged': 'Во время снимка страница прокрутилась, изменила размер или перешла по ссылке. Выделите область заново.',
  'error.captureGuestUnavailable': 'Эта вкладка Browser не предоставляет API снимков. Откройте аннотирование заново или обновите Harness.',
  'error.captureGuestFailed': 'Вкладка Browser не смогла снять видимую страницу. Проверьте, что она ещё открыта.',
  'error.guestHint': 'Нажмите на содержимое страницы, а не на рамку вкладки',
  'prompt.head': 'Аннотации к интерфейсу ({count}):',
  'prompt.item': '{index}. {label} — {comment}',
  'prompt.where': '   элемент: {selector}',
  'meta.title': 'Аннотировать что угодно',
  'meta.description': 'Выделите любой элемент интерфейса, оставьте комментарий и отправьте скриншоты с пометками в чат.',
};

module.exports = { name: 'dsh-annotate-anything', inject: ['slots', 'locale'], apply: apply };
