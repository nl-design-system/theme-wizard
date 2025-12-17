import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'lit',
        '@nl-design-system-community/css-scraper', // Lazy-loaded via wizard-scraper
        'linkedom', // Dependency of css-scraper, only used when scraping
      ],
    },
  },
});
