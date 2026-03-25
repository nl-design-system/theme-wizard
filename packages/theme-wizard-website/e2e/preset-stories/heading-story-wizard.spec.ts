import { test, expect } from '@playwright/test';
import { PresetWizardPage } from '../pages/PresetWizardPage';

let wizard: PresetWizardPage;

test.setTimeout(30000);

test.beforeEach(async ({ page }) => {
  wizard = new PresetWizardPage(page, 'heading');
  await wizard.goto();
});

test('wizard questions keep the intended order', async () => {
  await expect(wizard.legends).toHaveCount(12);
  await expect(wizard.legends.nth(0)).toHaveText('Kies de grootte van de H1');
  await expect(wizard.legends.nth(1)).toHaveText('Kies de grootte van de H2');
  await expect(wizard.legends.nth(2)).toHaveText('Kies de grootte van de H3');
  await expect(wizard.legends.nth(3)).toHaveText('Kies de grootte van de H4');
  await expect(wizard.legends.nth(4)).toHaveText('Kies de grootte van de H5');
  await expect(wizard.legends.nth(5)).toHaveText('Kies de grootte van de H6');
  await expect(wizard.legends.nth(6)).toHaveText('Kies de kleur van de H1');
  await expect(wizard.legends.nth(7)).toHaveText('Kies de kleur van de H2');
  await expect(wizard.legends.nth(8)).toHaveText('Kies de kleur van de H3');
  await expect(wizard.legends.nth(9)).toHaveText('Kies de kleur van de H4');
  await expect(wizard.legends.nth(10)).toHaveText('Kies de kleur van de H5');
  await expect(wizard.legends.nth(11)).toHaveText('Kies de kleur van de H6');
});

test('each heading size preset has 6 options (Klein through Enorm)', async () => {
  for (let level = 1; level <= 6; level++) {
    const count = await wizard.waitForOptions(`Kies de grootte van de H${level}`);
    expect(count).toBe(6);
  }
});

test('each heading color preset has 4 options (Standaard + 3 accentkleuren)', async () => {
  for (let level = 1; level <= 6; level++) {
    const count = await wizard.waitForOptions(`Kies de kleur van de H${level}`);
    expect(count).toBe(4);
  }
});

test('changing heading size preset updates the theme token', async () => {
  const groupLabel = 'Kies de grootte van de H1';
  const tokenPath = 'nl.heading.level-1.font-size';

  // Select "Enorm" (index 0) → basis.text.font-size.3xl
  await wizard.selectOption(groupLabel, 0);
  await expect.poll(() => wizard.readTokenValue(tokenPath)).toBe('{basis.text.font-size.3xl}');

  // Select "Klein" (index 5) → basis.text.font-size.sm
  await wizard.selectOption(groupLabel, 5);
  await expect.poll(() => wizard.readTokenValue(tokenPath)).toBe('{basis.text.font-size.sm}');
});

test('changing heading color preset updates the theme token', async () => {
  const groupLabel = 'Kies de kleur van de H2';
  const tokenPath = 'nl.heading.level-2.color';

  // Select "Accentkleur 1" (index 1)
  await wizard.selectOption(groupLabel, 1);
  await expect.poll(() => wizard.readTokenValue(tokenPath)).toBe('{basis.color.accent-1.color-document}');

  // Select "Standaard" (index 0)
  await wizard.selectOption(groupLabel, 0);
  await expect.poll(() => wizard.readTokenValue(tokenPath)).toBe('{basis.color.default.color-document}');
});

test('selected preset option shows a resolved CSS value', async () => {
  const groupLabel = 'Kies de grootte van de H1';

  await wizard.selectOption(groupLabel, 0);

  // Token reference should contain the scale path
  await expect.poll(() => wizard.readSelectedTokenReference(groupLabel)).toContain('basis.text.font-size.3xl');

  // Resolved value should be a CSS unit like "0.875rem"
  await expect.poll(() => wizard.readSelectedResolvedValue(groupLabel)).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
});

test('every preset step has a default option from the start theme', async () => {
  await wizard.assertAllPresetsHaveDefault();
});
