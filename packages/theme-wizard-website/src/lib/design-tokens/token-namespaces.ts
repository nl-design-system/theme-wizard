import type { TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { getBasisTokens, getBasisTokenTree } from './basis-token-nav';
import { getCommunityTokens, getCommunityTokenTree } from './community-token-nav';
import { getNlTokens, getNlTokenTree } from './nl-token-nav';
import { createTokenTreeNav, DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

interface TokenNamespaceDefinition {
  // URL segment and token path prefix, e.g. `basis` for /design-tokens/basis
  id: string;
  // Sidebar and top-level link label
  label: string;
  // Heading on the namespace index page
  heading: string;
  // Document title and index breadcrumb
  pageTitle: string;
  getTree: () => TokenTreeNode[];
  // Raw tokens the tree is built from, keyed like the tree, e.g. to read a token's `$deprecated`
  getTokens: () => Record<string, unknown>;
  // Prepended to tree paths to form token paths; defaults to `id`, null to omit
  tokenPathPrefix?: string | null;
}

// To add a namespace (e.g. utrecht, denhaag), add an entry here and a tree module it points at.
const DEFINITIONS = [
  {
    id: 'basis',
    getTokens: getBasisTokens,
    getTree: getBasisTokenTree,
    heading: 'Basis tokens',
    label: 'Basis tokens',
    pageTitle: 'Basis tokens',
  },
  {
    id: 'nl',
    getTokens: getNlTokens,
    getTree: getNlTokenTree,
    heading: 'Candidate component tokens',
    label: 'Candidate components',
    pageTitle: 'Candidate component tokens',
  },
  {
    id: 'community',
    getTokens: getCommunityTokens,
    getTree: getCommunityTokenTree,
    heading: 'Community component tokens',
    label: 'Community components',
    pageTitle: 'Community component tokens',
    tokenPathPrefix: null,
  },
] as const satisfies readonly TokenNamespaceDefinition[];

export const TOKEN_NAMESPACES = DEFINITIONS.map((definition) => {
  const href = `${DESIGN_TOKENS_BASE_URL}/${definition.id}`;
  const tokenPathPrefix = 'tokenPathPrefix' in definition ? definition.tokenPathPrefix : definition.id;
  return { ...definition, href, nav: createTokenTreeNav(href, tokenPathPrefix) };
});

export type TokenNamespace = (typeof TOKEN_NAMESPACES)[number];
export type TokenNamespaceId = TokenNamespace['id'];

export const getTokenNamespace = (id: string): TokenNamespace => {
  const namespace = TOKEN_NAMESPACES.find((candidate) => candidate.id === id);
  if (!namespace) {
    throw new Error(`Unknown token namespace: ${id}`);
  }
  return namespace;
};
