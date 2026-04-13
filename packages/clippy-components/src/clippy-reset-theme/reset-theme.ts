import buttonTokens from '@nl-design-system-candidate/button-tokens';
import codeBlockTokens from '@nl-design-system-candidate/code-block-tokens';
import codeTokens from '@nl-design-system-candidate/code-tokens';
import colorSampleTokens from '@nl-design-system-candidate/color-sample-tokens';
import dataBadgeTokens from '@nl-design-system-candidate/data-badge-tokens';
import headingTokens from '@nl-design-system-candidate/heading-tokens';
import linkTokens from '@nl-design-system-candidate/link-tokens';
import markTokens from '@nl-design-system-candidate/mark-tokens';
import numberBadgeTokens from '@nl-design-system-candidate/number-badge-tokens';
import paragraphTokens from '@nl-design-system-candidate/paragraph-tokens';
import skipLinkTokens from '@nl-design-system-candidate/skip-link-tokens';
import basisTokens from './basis-tokens.json';
import { createResetStylesheet } from './reset-css';

/* reset-theme stylesheet based on design token JSON for design tokens the theme wizard supports */
const tokens = [
  basisTokens,
  buttonTokens,
  codeBlockTokens,
  codeTokens,
  colorSampleTokens,
  dataBadgeTokens,
  headingTokens,
  linkTokens,
  markTokens,
  numberBadgeTokens,
  paragraphTokens,
  skipLinkTokens,
];

export const createResetTheme = (selector: string) => createResetStylesheet(tokens, selector);
