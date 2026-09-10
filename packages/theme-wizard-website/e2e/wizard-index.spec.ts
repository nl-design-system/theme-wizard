import { test, expect } from './fixtures/fixtures';

const STEPS = [
  { href: '/wizard/basis-text-font-family-default', label: 'Lettertype voor tekst' },
  { href: '/wizard/basis-color-default-color-document', label: 'Kleur voor tekst' },
  { href: '/wizard/basis-heading-font-family', label: 'Lettertype voor koppen' },
  { href: '/wizard/basis-heading-color', label: 'Kleur voor koppen' },
];

test('shows step-by-step navigation with tasks and completion status', async ({ page, wizardIndexPage }) => {
  await wizardIndexPage.goto();

  const nav = page.getByRole('navigation', { name: 'Maak stapsgewijs keuzes' });
  await expect(nav).toBeVisible();

  for (const { href, label } of STEPS) {
    // Task link is not prefixed with 'Taak afgerond:' yet, so exact match should be true
    const link = nav.getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
});

test('page allows to go back to staging tokens when that is where it came from', async ({
  baseURL,
  page,
  stagingTokensPage,
}) => {
  await page.goto('/wizard?from=staging-tokens');

  const link = page.getByRole('link', { name: 'Vorige stap' });
  await expect(link).toBeVisible();
  await link.click();
  expect(page.url()).toBe(new URL(stagingTokensPage.url, baseURL).toString());
});

test('page allows to go back to start when reached directly (e.g. starting from scratch)', async ({
  baseURL,
  page,
  wizardIndexPage,
}) => {
  await wizardIndexPage.goto();

  const link = page.getByRole('link', { name: 'Terug naar start' });
  await expect(link).toBeVisible();
  await link.click();
  expect(page.url()).toBe(new URL('/', baseURL).toString());
});

test('marks a task as done after saving a value', async ({ page, wizardStepFormPage }) => {
  await wizardStepFormPage.goto();

  const firstLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.first());
  await wizardStepFormPage.optionCard(firstLabel).click();
  await wizardStepFormPage.save();

  const nav = page.getByRole('navigation', { name: 'Maak stapsgewijs keuzes' });
  const task = nav.getByRole('link', { name: 'Taak afgerond: Lettertype voor tekst' });
  await expect(task).toBeVisible();
});
