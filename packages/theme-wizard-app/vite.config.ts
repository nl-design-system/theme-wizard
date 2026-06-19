import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

const thisDir = fileURLToPath(new URL('.', import.meta.url));
const clippyComponentsSrc = resolve(thisDir, '../clippy-components/src');
const clippyComponentsAssets = resolve(thisDir, '../clippy-components/assets');

export default defineConfig(() => ({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      // Auto-externalize dependencies from package.json instead of relying on hardcoded regexes
      external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    },
  },
  resolve: {
    alias: {
      '@lib': resolve(clippyComponentsSrc, 'lib'),
      '@nl-design-system-community/clippy-components': clippyComponentsSrc,
      '@nl-design-system-community/clippy-components/assets': clippyComponentsAssets,
      '@src': clippyComponentsSrc,
    },
  },
}));
