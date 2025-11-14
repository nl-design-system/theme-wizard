type TokenValue = {
  path?: string[];
  [key: string]: unknown;
};

type TokenScale = Record<string, unknown>;

const isTokenValue = (value: unknown): value is TokenValue =>
  Boolean(value && typeof value === 'object' && 'path' in value && Array.isArray((value as TokenValue).path));

const visitTokenTree = (node: unknown, onToken: (token: TokenValue) => void): void => {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (isTokenValue(node)) {
    onToken(node);
  }

  for (const child of Object.values(node)) {
    if (child && typeof child === 'object') {
      visitTokenTree(child, onToken);
    }
  }
};

export function collectTokenReferences(nodes: TokenScale | undefined): string[] {
  const references = new Set<string>();

  if (!nodes) {
    return [];
  }

  visitTokenTree(nodes, (token) => {
    const joinedPath = token.path?.join('.');
    if (joinedPath) {
      references.add(joinedPath);
    }
  });

  return Array.from(references);
}

export function groupTokenReferencesByScale(
  scales: Record<string, TokenScale | undefined> | undefined,
): Record<string, string[]> {
  if (!scales) {
    return {};
  }

  return Object.entries(scales).reduce<Record<string, string[]>>((grouped, [scaleName, scaleTokens]) => {
    const references = collectTokenReferences(scaleTokens);

    if (references.length) {
      grouped[scaleName] = references;
    }

    return grouped;
  }, {});
}
