import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    minify: mode !== 'development',
    rollupOptions: {
      external: (id) => /^@?lit(-\w+)?($|\/.+)/.test(id),
    },
  },
}));
