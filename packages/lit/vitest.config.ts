import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright({
        launchOptions: {
          slowMo: 100,
        },
      }),
      screenshotDirectory: new URL('./tmp/__screenshots__', import.meta.url).pathname,
    },
  },
});
