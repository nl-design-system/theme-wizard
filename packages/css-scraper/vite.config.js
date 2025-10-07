import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  assetsInclude: ['**/*.json'], // for css-tree
  build: {
    lib: {
      entry: resolve('./src/get-css.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // the .json is for css-tree because it requires .json files at runtime
      external: ['css-tree', 'linkedom', /\.json$/],
    },
  },
  plugins: [dts()],
});
