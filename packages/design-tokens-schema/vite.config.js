import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['zod', 'colorjs.io'],
      output: {
        entryFileNames: '[name].mjs',
      },
    },
  },
  plugins: [dts()],
});
