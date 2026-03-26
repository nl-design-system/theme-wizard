import { expect as baseExpect, test as baseTest, type Locator } from '@playwright/test';
import { BasisTokensPage } from '../pages/BasisTokensPage';
import { ComponentPage } from '../pages/ComponentPage';
import { HomePage } from '../pages/HomePage';
import { StagingTokensPage } from '../pages/StagingTokensPage';

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

export const test = baseTest.extend<{
  basisTokensPage: BasisTokensPage;
  homePage: HomePage;
  stagingTokensPage: StagingTokensPage;
  componentPage: ComponentPage;
}>({
  basisTokensPage: async ({ page }, use) => {
    const themeWizard = new BasisTokensPage(page);
    await use(themeWizard);
  },
  componentPage: async ({ page }, use) => {
    const componentPage = new ComponentPage(page);
    await use(componentPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  stagingTokensPage: async ({ page }, use) => {
    const stagingTokensPage = new StagingTokensPage(page);
    await use(stagingTokensPage);
  },
});
