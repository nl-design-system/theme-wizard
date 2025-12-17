import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// eslint-disable-next-line no-undef
const isBuildDesignTokens = process.env.VITE_BUILD_DESIGN_TOKENS === 'true';

export default defineConfig({
  build: {
    emptyOutDir: !isBuildDesignTokens,
    lib: {
      entry: resolve(isBuildDesignTokens ? './src/design-tokens.ts' : './src/get-css.ts'),
      fileName: isBuildDesignTokens ? 'design-tokens' : 'css-scraper',
      formats: ['es'],
    },
    rollupOptions: {
      external: isBuildDesignTokens ? ['linkedom', '@projectwallace/css-design-tokens'] : ['linkedom'],
    },
  },
  plugins: [dts({ outDir: 'dist', rollupTypes: !isBuildDesignTokens, tsconfigPath: './tsconfig.json' })],
});
