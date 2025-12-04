import { test as base } from '@playwright/test';
import { ThemeWizardPage } from '../pages/ThemeWizardPage';

type ThemeWizardFixture = {
  themeWizard: ThemeWizardPage;
  previewPage: ThemeWizardPage;
  collagePage: ThemeWizardPage;
};

export const test = base.extend<ThemeWizardFixture>({
  collagePage: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await themeWizard.selectTemplate('Collage 1');
    await use(themeWizard);
  },

  previewPage: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await themeWizard.selectTemplate('Overzichtspagina');
    await use(themeWizard);
  },

  themeWizard: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await use(themeWizard);
  },
});

export { expect } from '@playwright/test';
