import { test, expect } from '@playwright/test';
import { PresetWizardPage } from '../pages/PresetWizardPage';

let wizard: PresetWizardPage;

test.beforeEach(async ({ page }) => {
  wizard = new PresetWizardPage(page, 'button');
  await wizard.goto();
});

test('wizard questions keep the intended order', async () => {
  const startwaardenRow = wizard.page.locator('[data-todo-row]').filter({ hasText: 'Startwaarden' });
  const overviewTitles = startwaardenRow.locator('.wizard-step-overview-card__title');

  await expect(overviewTitles).toHaveCount(4);
  await expect(overviewTitles.nth(0)).toHaveText('Kies de minimale afmeting');
  await expect(overviewTitles.nth(1)).toHaveText('Kies de stijlrichting voor alle buttons');
  await expect(overviewTitles.nth(2)).toHaveText('Hoe afgerond mogen de hoeken van buttons zijn?');
  await expect(overviewTitles.nth(3)).toHaveText('Kies de tekstgrootte van alle buttons');
});
