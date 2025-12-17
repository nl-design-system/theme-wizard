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
  globalTimeout: 120_000,
  outputDir: './tmp/playwright-results/',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium', // opt-in for headless mode
        // Set Playwright explicitly in the user-agent string for easy allow-listing in firewall and checking logs
        userAgent: devices['Desktop Chrome'].userAgent + ' (Playwright Test)',
      },
    },
  ],
  /* Verbose logging in CI */
  quiet: !process.env.CI,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  testDir: './e2e',
  testMatch: '**/*spec.ts',
  /* Maximum time one test can run for. */
  timeout: process.env.CI ? 20_000 : 7500,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI
      ? 'https://theme-wizard-git-chore-pw-slowness-nl-design-system.vercel.app/'
      : 'http://localhost:9492',

    screenshot: {
      fullPage: true,
      mode: 'on-first-failure',
    },

    /* Collect trace for all tests in CI for better debugging. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // WCAG 100% dimensions
    viewport: {
      height: 1280,
      width: 1024,
    },
  },

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      name: 'API Server',
      command: 'pnpm run dev',
      cwd: '../theme-wizard-server',
      port: 9491,
      reuseExistingServer: !process.env.CI,
      // Log server errors directly to the main output for easier debugging in CI
      stderr: 'pipe',
      // How long the server can take to start up
      timeout: 10_000,
    },
    {
      name: 'Website',
      command: 'pnpm run dev',
      port: 9492,
      reuseExistingServer: !process.env.CI,
      // How long the server can take to start up
      timeout: 10_000,
    },
  ],

  /* Let GitHub Actions use 4 workers; Locally let Playwright figure out how many to use. */
  workers: process.env.CI ? 4 : undefined,
};

export default config;
