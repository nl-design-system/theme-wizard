import { test, expect } from '@playwright/test';
import { PresetWizardPage } from '../pages/PresetWizardPage';

let wizard: PresetWizardPage;

test.beforeEach(async ({ page }) => {
  wizard = new PresetWizardPage(page, 'data-badge');
  await wizard.goto();
});

test('wizard questions keep the intended order', async () => {
  await expect(wizard.legends).toHaveCount(2);
  await expect(wizard.legends.nth(0)).toHaveText('Kies de kleur voor de Data Badge');
  await expect(wizard.legends.nth(1)).toHaveText('Kies de vorm van de Data Badge');
});
