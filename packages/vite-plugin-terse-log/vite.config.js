import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: [/^node:/, 'vite'],
    },
    sourcemap: false,
  },
  plugins: [dts()],
});
