import { test as base, type Locator } from '@playwright/test';
import { expect as baseExpect } from '@playwright/test';
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
    await themeWizard.selectTemplate('Collage (Component Variaties)');
    await use(themeWizard);
  },

  previewPage: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await themeWizard.selectTemplate('Preview');
    await use(themeWizard);
  },

  themeWizard: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await use(themeWizard);
  },
});
