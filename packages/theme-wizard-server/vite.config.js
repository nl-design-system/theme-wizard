import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';

const PORT = 9491; // (T9 for WIZ)1

const serverConfig = {
  cors: false, // disable Vite CORS in favour of HonoJS's CORS
  port: PORT,
  strictPort: true,
};

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    ssr: true,
  },
  plugins: [
    devServer({
      entry: 'src/index.ts',
    }),
  ],
  preview: serverConfig,
  server: serverConfig,
});
