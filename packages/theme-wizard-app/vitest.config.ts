import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const thisDir = fileURLToPath(new URL('.', import.meta.url));
const clippyComponentsSrc = resolve(thisDir, '../clippy-components/src');

export default defineConfig({
  resolve: {
    alias: {
      '@lib': resolve(clippyComponentsSrc, 'lib'),
      '@nl-design-system-community/clippy-components': clippyComponentsSrc,
      '@src': clippyComponentsSrc,
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
  },
});
