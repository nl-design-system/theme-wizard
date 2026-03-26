import { chromium, type FullConfig } from '@playwright/test';
import path from 'node:path';

export const storageStatePath = path.join('tmp', 'staging-tokens-storage-state.json');

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/`);

  await page.getByLabel('Website URL').fill('nldesignsystem.nl');
  await page.getByRole('button', { name: 'Huisstijl ophalen' }).click();

  // Wait for the fetch() request to complete. This is faster than waiting for the loaders to disappear.
  await page.waitForResponse(
    (response) => response.url().includes('/api/v1/css-design-tokens?url=') && response.status() === 200,
  );

  // Wait until the app has written the scraped tokens to localStorage.
  await page.waitForFunction(() => localStorage.getItem('v0:scraped-tokens:JSON:_') !== null);

  await page.context().storageState({ path: storageStatePath });
  await browser.close();
}
