import { defineConfig } from 'vite';
import litCss from 'vite-plugin-lit-css';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit'],
    },
  },
  plugins: [litCss()]
});
