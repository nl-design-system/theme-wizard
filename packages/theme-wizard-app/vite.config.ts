import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => /^@?lit(-\w+)?($|\/.+)/.test(id),
    },
  },
});
