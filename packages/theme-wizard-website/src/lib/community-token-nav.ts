import { buildTokenTree } from '@nl-design-system-community/design-tokens-schema';
import amsPageHeaderTokens from './stories/community/ams.page-header.tokens.json' with { type: 'json' };

// Unlike `nl`, community tokens keep their organisation prefix as top-level key,
// so URLs become /design-tokens/community/<organisation>/<slug>.
const COMMUNITY_TOKENS: Record<string, unknown> = {
  ams: {
    'page-header': amsPageHeaderTokens.ams['page-header'],
  },
};

export const getCommunityTokenTree = () => buildTokenTree(COMMUNITY_TOKENS);
