import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', 'lit/directives/class-map.js', 'lit/directives/unsafe-svg.js'],
    },
  },
});
