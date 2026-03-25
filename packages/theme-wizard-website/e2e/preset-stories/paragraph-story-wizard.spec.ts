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

test('choosing the start-theme preset counts as a design choice', async () => {
  await wizard.assertSelectionsSummary('Design keuzes (0/6)');

  await wizard.selectOption('Kies de grootte van de paragraph', 0);

  await wizard.assertSelectionsSummary('Design keuzes (1/6)');
});

test('reset restores the start-theme preset selections', async () => {
  await expect.poll(() => wizard.readDefaultIndex('Kies de grootte van de paragraph')).toBe(0);
  await expect.poll(() => wizard.readSelectedIndex('Kies de grootte van de paragraph')).toBe(0);
  await wizard.assertSelectionsSummary('Design keuzes (0/6)');

  await wizard.selectOption('Kies de grootte van de paragraph', 1);
  await expect.poll(async () => (await wizard.readSelectionsSummary()) !== 'Design keuzes (0/6)').toBe(true);

  await wizard.assertResetRestoresPresetSelections(
    [
      {
        defaultIndex: 0,
        groupLabel: 'Kies de grootte van de paragraph',
        selectedIndex: 0,
        selectedLabel: 'Aanbevolen',
      },
      {
        defaultIndex: 1,
        groupLabel: 'Kies de grootte van de lead paragraph',
        selectedIndex: 1,
        selectedLabel: 'Extra ruim',
      },
      {
        defaultIndex: 0,
        groupLabel: 'Kies de kleur van de lead paragraph',
        selectedIndex: 0,
        selectedLabel: 'Aanbevolen',
      },
    ],
    'Design keuzes (0/6)',
  );
});
