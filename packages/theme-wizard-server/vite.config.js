import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    ssr: {
      noExternal: [],
    },
  },
  plugins: [
    devServer({
      entry: 'src/index.ts',
    }),
  ],
});
