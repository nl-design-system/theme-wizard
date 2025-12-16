// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  server: {
    port: 9493, // (T9 for WIZ)3
  },
  vite: {
    define: {
      __STANDALONE_PACKAGE__: true, // for building templates as standalone website
    },
  },
});
