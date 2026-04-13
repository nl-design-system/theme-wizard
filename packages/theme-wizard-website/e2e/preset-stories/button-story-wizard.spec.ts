import { test, expect } from '@playwright/test';
import { PresetWizardPage } from '../pages/PresetWizardPage';

let wizard: PresetWizardPage;

test.beforeEach(async ({ page }) => {
  wizard = new PresetWizardPage(page, 'button');
  await wizard.goto();
});

test('wizard questions keep the intended order', async () => {
  await expect(wizard.legends).toHaveCount(6);
  await expect(wizard.legends.nth(0)).toHaveText('Kies de minimale afmeting');
  await expect(wizard.legends.nth(1)).toHaveText('Welke stijl wil je voor de standaard button?');
  await expect(wizard.legends.nth(2)).toHaveText('Welke stijl wil je voor de primary button?');
  await expect(wizard.legends.nth(3)).toHaveText('Welke stijl wil je voor de secondary button?');
  await expect(wizard.legends.nth(4)).toHaveText('Hoe afgerond mogen de hoeken van buttons zijn?');
  await expect(wizard.legends.nth(5)).toHaveText('Kies de tekstgrootte van alle buttons');
});
