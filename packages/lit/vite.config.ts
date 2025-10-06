import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    lib: { name: 'lit', entry: 'index.ts', fileName: 'index', formats: ['es'] },
  },
  plugins: [
    viteStaticCopy({
      hook: 'writeBundle',
      targets: [{ dest: '../../website/public/build', rename: 'lit.esm.js', src: 'dist/index.js' }],
    }),
  ],
});
