import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'run-server',
      configureServer() {
        import('./src/index.ts');
      },
    },
  ],
});
