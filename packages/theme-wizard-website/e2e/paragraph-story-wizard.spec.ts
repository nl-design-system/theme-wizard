import { test, expect } from '@playwright/test';

test('changing the paragraph preset also updates the lead paragraph preset', async ({ page }) => {
  await page.goto('/components/paragraph');

  const wizardTokenPreset = page.locator('wizard-token-preset[group-label="Kies de grootte van de paragraph"]');
  const readThemeValues = () =>
    page.locator('theme-wizard-app').evaluate((element) => {
      const themeHost = element as HTMLElement & {
        theme?: {
          at: (path: string) => { $value?: unknown } | undefined;
        };
      };

      return {
        lead: themeHost.theme?.at('nl.paragraph.lead.font-size')?.$value ?? null,
        paragraph: themeHost.theme?.at('nl.paragraph.font-size')?.$value ?? null,
      };
    });

  // Wait for the component to be ready with options before interacting
  await expect
    .poll(() =>
      wizardTokenPreset.evaluate(
        (el) => (el as HTMLElement & { options: unknown[] }).options?.length > 0,
      ),
    )
    .toBe(true);

  for (const [index] of ['Aanbevolen', 'Ruim', 'Extra ruim'].entries()) {
    await wizardTokenPreset.evaluate((element, selectedIndex) => {
      (element as HTMLElement & { selectIndex: (index: number) => void }).selectIndex(selectedIndex);
    }, index);
  }

  await expect.poll(readThemeValues).toEqual({
    lead: '{basis.text.font-size.xl}',
    paragraph: '{basis.text.font-size.xl}',
  });
});
