import { test, expect } from '@playwright/test';
import { PresetWizardPage } from '../pages/PresetWizardPage';

let wizard: PresetWizardPage;

test.beforeEach(async ({ page }) => {
  wizard = new PresetWizardPage(page, 'paragraph');
  await wizard.goto();
});

test('wizard questions keep the intended order', async () => {
  await expect(wizard.legends).toHaveCount(3);
  await expect(wizard.legends.nth(0)).toHaveText('Kies de grootte van de paragraph');
  await expect(wizard.legends.nth(1)).toHaveText('Kies de grootte van de lead paragraph');
  await expect(wizard.legends.nth(2)).toHaveText('Kies de kleur van de lead paragraph');
});

test('changing the paragraph preset also updates the lead paragraph preset', async () => {
  const groupLabel = 'Kies de grootte van de paragraph';

  for (const [index] of ['Aanbevolen', 'Ruim', 'Extra ruim'].entries()) {
    await wizard.selectOption(groupLabel, index);
  }

  await expect.poll(() => wizard.readTokenValue('nl.paragraph.font-size')).toBe('{basis.text.font-size.xl}');
  await expect.poll(() => wizard.readTokenValue('nl.paragraph.lead.font-size')).toBe('{basis.text.font-size.2xl}');
});
