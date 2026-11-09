'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CaptureError, captureErrorKey, captureGuest, cropDataUrl } = require('../src/capture.cjs');

test('capture errors distinguish size, protection, decoding, changed page and unavailable APIs', () => {
  for (const [code, key] of Object.entries({ tooLarge: 'captureTooLarge', protected: 'captureProtected',
    decode: 'captureDecode', changed: 'captureChanged', guestUnavailable: 'captureGuestUnavailable' })) {
    assert.equal(captureErrorKey(new CaptureError(code)), 'error.' + key);
  }
  assert.equal(captureErrorKey(new DOMException('private URL', 'SecurityError')), 'error.captureProtected');
  assert.equal(captureErrorKey(new Error('private URL')), 'error.captureFailed');
});

test('guest cleanup failure does not hide a changed selection error', async () => {
  let calls = 0;
  const guest = { capturePage() { throw new Error('must not capture'); }, executeJavaScript() {
    if (++calls === 1) return Promise.resolve(null);
    throw new Error('tab closed during cleanup');
  } };
  await assert.rejects(captureGuest(guest, { x: 0, y: 0, width: 30, height: 30 }), { code: 'changed' });
  assert.equal(calls, 2);
  await assert.rejects(captureGuest(null, {}), { code: 'guestUnavailable' });
});

test('an oversized guest rectangle is reported as size, not changed page', async () => {
  const guest = { capturePage() { throw new Error('must not capture'); },
    executeJavaScript: async () => ({ width: 3000, height: 2000 }) };
  await assert.rejects(captureGuest(guest, { x: 0, y: 0, width: 3000, height: 2000 }), { code: 'tooLarge' });
});

test('image decoder failure has a specific safe error code', async () => {
  const previous = global.Image;
  global.Image = class { async decode() { throw new Error('private source'); } };
  try { await assert.rejects(cropDataUrl('data:broken', {}, {}), { code: 'decode' }); }
  finally { global.Image = previous; }
});
