// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  publicDir: 'build',
  vite: {
    ssr: {
      external: ['@nl-design-system-community/stencil/loader'],
    },
    optimizeDeps: {
      include: ['@nl-design-system-community/stencil/loader'],
    },
    resolve: {
      alias: {
        '@nl-design-system-community/stencil/loader': fileURLToPath(
          new URL('../stencil/build/loader/index.js', import.meta.url),
        ),
      },
    },
  },
});
