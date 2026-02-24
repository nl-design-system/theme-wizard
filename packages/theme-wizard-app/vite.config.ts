import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id) => /^@?lit(-\w+)?($|\/.+)/.test(id),
    },
  },
}));
