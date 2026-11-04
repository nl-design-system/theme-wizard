import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id) => id.startsWith('node:') || deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        banner: '#!/usr/bin/env node',
        entryFileNames: '[name].js',
      },
    },
  },
  define: {
    // We *could* import package.json in our module, but then Vite
    // inlines all of package.json. Using `define` we only get what we need.
    __VERSION__: JSON.stringify(pkg.version),
  },
});
