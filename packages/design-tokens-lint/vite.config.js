import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: [/^node:/, '@nl-design-system-community/design-tokens-schema'],
      output: {
        banner: '#!/usr/bin/env node',
        entryFileNames: '[name].js',
      },
    },
  },
  define: {
    // We *could* import package.json in our module, but then Vite
    // inlines all of package.json. Using `define` we only get what we need.
    __VERSION__: JSON.stringify(version),
  },
});
