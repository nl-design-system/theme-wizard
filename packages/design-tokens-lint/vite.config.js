import { resolve } from 'node:path';
import { defineConfig } from 'vite';

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
});
