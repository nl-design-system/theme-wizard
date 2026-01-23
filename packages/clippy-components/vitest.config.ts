import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const thisDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  optimizeDeps: {
    include: [
      'lit',
      'lit/decorators.js',
      'lit/static-html.js',
      'lit/directives/class-map.js',
      'lit/directives/style-map.js',
    ],
  },
  resolve: {
    alias: {
      '@lib': resolve(thisDir, 'src/lib'),
      '@src': resolve(thisDir, 'src'),
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
      screenshotDirectory: new URL('./tmp/__screenshots__', import.meta.url).pathname,
    },
    exclude: ['dist/**', 'node_modules/**'],
    include: ['src/**/*.{test,spec}.ts'],
  },
});
