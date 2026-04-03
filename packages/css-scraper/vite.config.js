import { resolve } from 'node:path';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/get-css.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@nl-design-system-community/design-tokens-schema',
        '@projectwallace/css-design-tokens',
        '@projectwallace/css-parser',
        'linkedom',
        'zod',
      ],
    },
  },
  plugins: [dts()],
});
