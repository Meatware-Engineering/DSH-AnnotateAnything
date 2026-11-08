import { build } from 'esbuild';
import fs from 'node:fs';

const result = await build({
  entryPoints: ['src/client.cjs'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  minify: false,
  external: ['react'],
  write: false,
  legalComments: 'none',
});

const bundle = result.outputFiles[0].text;
const out = [
  'window.__ModuleLoader__.load({ id: "dsh-annotate-anything", factory: (require) => {',
  'var module = { exports: {} }; var exports = module.exports;',
  bundle,
  'return module.exports;',
  '} });',
  '',
].join('\n');
fs.writeFileSync('client.js', out);
console.log('client.js', out.length, 'bytes');
