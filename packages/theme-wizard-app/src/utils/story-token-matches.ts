import type { Meta, StoryObj } from '@storybook/react-vite';
import { isRef, extractRef, type TokenPath } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import { loadComponentStories, type ComponentStoriesRegistry } from './component-stories';

export type MatchedToken = {
  // Path of the component's own token, e.g. `nl.link.hover.color`.
  path: string;
  // The basis ref that satisfied the match, e.g. `basis.color.accent-1.color-hover`.
  ref: string;
};

export type StoryMatch = {
  componentId: string;
  id: string;
  matchedTokens: MatchedToken[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Meta<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: StoryObj<any>;
};

export type { ComponentStoriesRegistry } from './component-stories';

// A story with an editable token, plus the token's own paths (e.g. `nl.link.color`) —
// everything derivable from the story modules alone, independent of any theme or groups.
export type StoryCandidate = {
  componentId: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Meta<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: StoryObj<any>;
  tokenPaths: string[];
};

// `editableTokens` leaves are informal `{ $value: ... }` placeholders (no `$type`), so this
// can't reuse design-tokens-schema's stricter `isTokenLike`/`walkTokens` — a leaf here is any
// plain object carrying a `$value` key, full stop.
function getEditableTokenPaths(editableTokens: unknown, path: TokenPath = []): string[] {
  if (typeof editableTokens !== 'object' || editableTokens === null) {
    return [];
  }

  if (Object.hasOwn(editableTokens, '$value')) {
    return [path.join('.')];
  }

  return Object.entries(editableTokens).flatMap(([key, value]) => getEditableTokenPaths(value, [...path, key]));
}

// Picks every story with editable tokens and extracts their token paths. Story modules are loaded
// once per registry (see `loadComponentStories`), so callers can call this whenever their registry is set.
export async function prepareStoryCandidates(components: ComponentStoriesRegistry): Promise<StoryCandidate[]> {
  const loadedComponents = await loadComponentStories(components);

  return loadedComponents.flatMap(({ componentId, meta, stories }) =>
    stories.flatMap(([id, story]) => {
      const editableTokens = story.parameters?.['editableTokens'];
      const tokenPaths = editableTokens ? getEditableTokenPaths(editableTokens) : [];
      return tokenPaths.length > 0 ? [{ id, componentId, meta, story, tokenPaths }] : [];
    }),
  );
}

// A group path is a dot-separated basis token path, e.g. `basis.color.accent-1` or
// `basis.text.font-family.default`. A ref matches when it *is* that path, or is nested under it.
function referencesGroup(ref: string, groupPath: string): boolean {
  return ref === groupPath || ref.startsWith(`${groupPath}.`);
}

// Refs can chain (e.g. nl.link.color -> basis.color.action-2.color-default -> basis.color.accent-1.color-default),
// so follow the chain until we find a match, a dead end, or a cycle.
// Returns the basis ref that matched, so callers can show *why* something matched.
function resolveMatchingRef(
  themeTokens: Record<string, unknown>,
  path: string,
  groupPaths: string[],
  seen: Set<string> = new Set(),
): string | null {
  if (seen.has(path)) {
    return null;
  }
  seen.add(path);

  // A token's own path can already be one of the groupPaths (e.g. a component's own leaf
  // token, like `nl.data-badge.background-color`, viewed on its own design-tokens page) —
  // that's a match in itself, with nothing to dereference.
  if (groupPaths.some((groupPath) => referencesGroup(path, groupPath))) {
    return path;
  }

  // A ref can omit the `brand.` prefix even when the token it points to is nested under it —
  // same fallback `resolveRef` in design-tokens-schema's resolve-refs.ts uses.
  const token = (dlv(themeTokens, path) ?? dlv(themeTokens, `brand.${path}`)) as { $value?: unknown } | undefined;
  const value = token?.$value;
  if (!isRef(value)) {
    return null;
  }

  const ref = extractRef(value);
  if (groupPaths.some((groupPath) => referencesGroup(ref, groupPath))) {
    return ref;
  }

  return resolveMatchingRef(themeTokens, ref, groupPaths, seen);
}

/**
 * Find which stories have editableTokens which $values point to one of the groupPaths
 */
export function findMatchingStories(
  groupPaths: string[],
  themeTokens: Record<string, unknown>,
  candidates: StoryCandidate[],
): StoryMatch[] {
  const matches: StoryMatch[] = [];

  for (const { id, componentId, meta, story, tokenPaths } of candidates) {
    const matchedTokens: MatchedToken[] = tokenPaths
      .map((path) => ({ path, ref: resolveMatchingRef(themeTokens, path, groupPaths) }))
      .filter((entry): entry is MatchedToken => entry.ref !== null);

    if (matchedTokens.length > 0) {
      matches.push({ id, componentId, matchedTokens, meta, story });
    }
  }

  return matches;
}
