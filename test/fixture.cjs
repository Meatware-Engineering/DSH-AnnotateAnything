'use strict';
const { buildSync } = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const fixture = buildSync({ stdin: { contents: `
const React = require('react');
const { createRoot } = require('react-dom/client');
window.__ModuleLoader__ = { load(entry) { window.testPlugin = entry.factory(() => React); } };
window.mountTestPlugin = () => {
const plugin = window.testPlugin;
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
};
`, resolveDir: path.join(__dirname, '..') }, bundle: true, platform: 'browser', write: false,
  nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean) }).outputFiles[0].text;
const productionClient = fs.readFileSync(path.join(__dirname,'..','client.js'),'utf8');
async function mount(page) {
  await page.addScriptTag({content:fixture});
  await page.addScriptTag({content:productionClient});
  await page.evaluate(()=>window.mountTestPlugin());
}
module.exports = { fixture, productionClient, mount };
