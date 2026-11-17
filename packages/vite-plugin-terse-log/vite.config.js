import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id) => id.startsWith('node:') || deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    },
    sourcemap: false,
  },
  plugins: [dts()],
});
