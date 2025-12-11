import { expect as baseExpect, test as baseTest, type Locator } from '@playwright/test';
import { ThemeWizardPage } from '../pages/ThemeWizardPage';

type ThemeWizardFixture = {
  themeWizard: ThemeWizardPage;
  previewPage: ThemeWizardPage;
  collagePage: ThemeWizardPage;
};

type MatcherResult =
  | {
      actual?: string;
      expected: string;
      name: string;
      message?: string;
      pass: boolean;
    }
  | undefined;

export const expect = baseExpect.extend({
  async toHaveFont(locator: Locator, expectedFont: string, options?: { timeout?: number }) {
      const assertionName = 'toHaveFont';
      let pass: boolean;
      let matcherResult: MatcherResult = undefined;

      try {
        const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
        await expectation.toHaveCSS('font-family', new RegExp(expectedFont), options);
        pass = true;
      } catch (error: unknown) {
        if (error instanceof Error && 'matcherResult' in error) {
          matcherResult = error.matcherResult as MatcherResult;
        } else {
          throw new Error('Failed to get font family');
        }
        pass = false;
      }

      if (this.isNot) {
        pass = !pass;
      }

      const locatorString = (locator as { toString(): string }).toString();

      const message = pass
        ? () =>
            this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Locator: ${locatorString}\n` +
            `Expected: not ${this.utils.printExpected(expectedFont)}\n` +
            (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')
        : () =>
            this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Locator: ${locatorString}\n` +
            `Expected: ${this.utils.printExpected(expectedFont)}\n` +
            (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

      return {
        name: assertionName,
        actual: matcherResult?.actual,
        expected: expectedFont,
        message,
        pass,
      };
    },
});

export const test = baseTest.extend<ThemeWizardFixture>({
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
