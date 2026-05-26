import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

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
}));
