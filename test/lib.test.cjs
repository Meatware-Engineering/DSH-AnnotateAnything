'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../src/lib.cjs');
const guest = require('../src/guest.cjs');

function fakeElement(tagName, extras) {
  const element = Object.assign(
    {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      classList: [],
      children: [],
      parentElement: null,
      attributes: {},
      innerText: '',
    },
    extras || {},
  );
  element.getAttribute = (name) => (name in element.attributes ? element.attributes[name] : null);
  return element;
}

test('clip collapses whitespace and bounds length', () => {
  assert.equal(lib.clip('  a \n  b  '), 'a b');
  assert.equal(lib.clip('abcdef', 4), 'abc…');
});

test('selectorOf builds a bounded path with nth-of-type', () => {
  const parent = fakeElement('div');
  const first = fakeElement('span', { innerText: 'first' });
  const second = fakeElement('span', { classList: ['label', 'wide'] });
  parent.children = [first, second];
  first.parentElement = parent;
  second.parentElement = parent;
  assert.equal(lib.selectorOf(second, 2), 'div > span.label.wide:nth-of-type(2)');
});

test('elementLabel prefers aria-label over text', () => {
  const el = fakeElement('button', { innerText: 'Send', attributes: { 'aria-label': 'Send message' } });
  assert.equal(lib.elementLabel(el), 'Send message');
});

test('dataUrlToBytes decodes a tiny png payload', () => {
  const decoded = lib.dataUrlToBytes('data:image/png;base64,AAEC');
  assert.equal(decoded.mediaType, 'image/png');
  assert.deepEqual(Array.from(decoded.bytes), [0, 1, 2]);
  assert.throws(() => lib.dataUrlToBytes('data:image/png,raw'));
});

test('formatAnnotations lists every annotation with its selector', () => {
  const t = (key, params) =>
    key === 'prompt.head'
      ? `Annotations (${params.count}):`
      : key === 'prompt.item'
        ? `${params.index}. ${params.label} — ${params.comment}`
        : `   element: ${params.selector}`;
  const text = lib.formatAnnotations(
    [
      { desc: { tag: 'button', label: 'Send', selector: 'button.send' }, comment: 'too small' },
      { desc: { tag: 'div', label: '', selector: 'div#chat' }, comment: '' },
    ],
    t,
  );
  assert.equal(text, 'Annotations (2):\n1. Send — too small\n   element: button.send\n2. div — —\n   element: div#chat');
});

test('guest scripts parse and carry the console marker', () => {
  assert.equal(typeof guest.GUEST_INSTALL, 'string');
  assert.ok(guest.GUEST_INSTALL.includes(guest.MARK));
  assert.doesNotThrow(() => new Function(guest.GUEST_INSTALL));
  assert.doesNotThrow(() => new Function(guest.GUEST_REMOVE));
});
