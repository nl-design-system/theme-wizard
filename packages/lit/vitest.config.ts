import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: 'playwright',
      screenshotDirectory: new URL('__screenshots__', import.meta.url).pathname,
    },
  },
});
