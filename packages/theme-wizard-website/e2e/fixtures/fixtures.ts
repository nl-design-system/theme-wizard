import { expect as baseExpect, test as baseTest, type Locator } from '@playwright/test';
import { BasisTokensPage } from '../pages/BasisTokensPage';
import { ComponentPage } from '../pages/ComponentPage';
import { MinifyTokensPage } from '../pages/MinifyTokensPage';
import { ReuseTokensPage } from '../pages/ReuseTokensPage';
import { ScraperPage } from '../pages/ScraperPage';
import { StagingTokensPage } from '../pages/StagingTokensPage';
import { StarterPickerPage } from '../pages/StarterPickerPage';
import { ValidateTokensPage } from '../pages/ValidateTokensPage';
import { WizardIndexPage } from '../pages/WizardIndexPage';
import { WizardStepFormPage } from '../pages/WizardStepFormPage';

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
        throw new Error('Failed to get font family', {
          cause: error,
        });
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
  scraperPage: ScraperPage;
  minifyTokensPage: MinifyTokensPage;
  reuseTokensPage: ReuseTokensPage;
  stagingTokensPage: StagingTokensPage;
  starterPickerPage: StarterPickerPage;
  componentPage: ComponentPage;
  validateTokensPage: ValidateTokensPage;
  wizardIndexPage: WizardIndexPage;
  wizardStepFormPage: WizardStepFormPage;
}>({
  basisTokensPage: async ({ page }, use) => {
    const themeWizard = new BasisTokensPage(page);
    await use(themeWizard);
  },
  componentPage: async ({ page }, use) => {
    const componentPage = new ComponentPage(page);
    await use(componentPage);
  },
  minifyTokensPage: async ({ page }, use) => {
    const minifyTokensPage = new MinifyTokensPage(page);
    await use(minifyTokensPage);
  },
  reuseTokensPage: async ({ page }, use) => {
    const reuseTokensPage = new ReuseTokensPage(page);
    await use(reuseTokensPage);
  },
  scraperPage: async ({ page }, use) => {
    const scraperPage = new ScraperPage(page);
    await use(scraperPage);
  },
  stagingTokensPage: async ({ page }, use) => {
    const stagingTokensPage = new StagingTokensPage(page);
    await use(stagingTokensPage);
  },
  starterPickerPage: async ({ page }, use) => {
    const starterPickerPage = new StarterPickerPage(page);
    await use(starterPickerPage);
  },
  validateTokensPage: async ({ page }, use) => {
    const validateTokensPage = new ValidateTokensPage(page);
    await use(validateTokensPage);
  },
  wizardIndexPage: async ({ page }, use) => {
    const wizardIndexPage = new WizardIndexPage(page);
    await use(wizardIndexPage);
  },
  wizardStepFormPage: async ({ page }, use) => {
    const wizardStepFormPage = new WizardStepFormPage(page);
    await use(wizardStepFormPage);
  },
});
