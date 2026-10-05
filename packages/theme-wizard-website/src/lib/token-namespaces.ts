import type { TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { getBasisTokenTree } from './basis-token-nav';
import { getNlTokenTree } from './nl-token-nav';
import { createTokenTreeNav } from './token-tree-nav';

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
}

// To add a namespace (e.g. utrecht, denhaag), add an entry here and a tree module it points at.
const DEFINITIONS = [
  {
    id: 'basis',
    getTree: getBasisTokenTree,
    heading: 'Basis tokens',
    label: 'Basis tokens',
    pageTitle: 'Basis tokens',
  },
  {
    id: 'nl',
    getTree: getNlTokenTree,
    heading: 'Candidate component tokens',
    label: 'Candidate components',
    pageTitle: 'Candidate component tokens',
  },
] as const satisfies readonly TokenNamespaceDefinition[];

export const TOKEN_NAMESPACES = DEFINITIONS.map((definition) => {
  const href = `/design-tokens/${definition.id}`;
  return { ...definition, href, nav: createTokenTreeNav(href, definition.id) };
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
