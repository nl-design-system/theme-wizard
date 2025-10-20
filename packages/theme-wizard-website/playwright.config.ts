import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Maximum time the entire test suite can run for */
  globalTimeout: 10 * 60 * 1000,
  outputDir: './tmp/playwright-results/',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Set Playwright explicitly in the user-agent string for easy allow-listing in firewall and checking logs
        userAgent: devices['Desktop Chrome'].userAgent + ' (Playwright Test)',
      },
    },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  testDir: './e2e',
  testMatch: '**/*spec.ts',
  /* Maximum time one test can run for. */
  timeout: process.env.CI ? 10_000 : 5000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:9492',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // WCAG 100% dimensions
    viewport: {
      height: 1280,
      width: 1024,
    },
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? 'pnpm preview' : 'pnpm dev',
    port: 9492,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000, // 10 minutes
  },

  /* Let GitHub Actions use 4 workers; Locally let Playwright figure out how many to use. */
  workers: process.env.CI ? 4 : undefined,
};

export default config;
