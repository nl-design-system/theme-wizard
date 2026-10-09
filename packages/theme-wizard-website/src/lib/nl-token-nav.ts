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
import { buildTokenTree } from '@nl-design-system-community/design-tokens-schema';

// Each package's tokens.json is shaped `{ nl: { <slug>: { ...tokens } } }`.
// Merge all installed components' subtrees into one root keyed by slug, so tree
// top-level keys line up 1:1 with /design-tokens/nl/<slug> URL segments.
const COMPONENT_TOKENS: Record<string, unknown> = {
  button: buttonTokens.nl.button,
  code: codeTokens.nl.code,
  'code-block': codeBlockTokens.nl['code-block'],
  'color-sample': colorSampleTokens.nl['color-sample'],
  'data-badge': dataBadgeTokens.nl['data-badge'],
  heading: headingTokens.nl.heading,
  link: linkTokens.nl.link,
  mark: markTokens.nl.mark,
  'number-badge': numberBadgeTokens.nl['number-badge'],
  paragraph: paragraphTokens.nl.paragraph,
  'skip-link': skipLinkTokens.nl['skip-link'],
};

export const getNlTokenTree = () => buildTokenTree(COMPONENT_TOKENS);
