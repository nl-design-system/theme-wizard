import { chromium, type FullConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const storageStatePath = path.join('tmp', 'staging-tokens-storage-state.json');

const scrapedTokensFixture = JSON.parse(
  readFileSync(new URL('./fixtures/scraped-tokens.json', import.meta.url), 'utf8'),
);

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/`);

  await page.evaluate((tokens) => {
    localStorage.setItem('v0:scraped-tokens:JSON:_', JSON.stringify(tokens));
  }, scrapedTokensFixture);

  await page.context().storageState({ path: storageStatePath });
  await browser.close();
}
