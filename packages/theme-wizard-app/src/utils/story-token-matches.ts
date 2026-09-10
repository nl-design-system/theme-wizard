import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DesignTokens } from 'style-dictionary/types';
import { isRef, extractRef, type TokenPath } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import { getStories } from './csf-utils';

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

// Caller-supplied registry of which components exist and how to load their stories module —
// callers own the actual story files, this module only knows how to match against them.
export type ComponentStoriesRegistry = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stories: () => Promise<{ default: Meta<any>; [key: string]: any }>;
  }
>;

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

// Loads every component's stories module and extracts editableToken paths. Stories don't
// change at runtime, so callers should call this once (e.g. whenever their component registry
// is set) and reuse the result across theme/group changes, rather than reloading and re-walking
// every story on every match run.
export async function prepareStoryCandidates(components: ComponentStoriesRegistry): Promise<StoryCandidate[]> {
  const candidates: StoryCandidate[] = [];

  await Promise.all(
    Object.entries(components).map(async ([componentId, { stories }]) => {
      const componentModule = await stories();
      const { default: meta, ...storyExports } = componentModule;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storyList = getStories(storyExports as unknown as Record<PropertyKey, StoryObj<any>>, meta);

      for (const [id, story] of storyList) {
        const editableTokens = story.parameters?.['editableTokens'];
        if (!editableTokens) continue;

        const tokenPaths = getEditableTokenPaths(editableTokens);
        if (tokenPaths.length === 0) continue;

        candidates.push({ id, componentId, meta, story, tokenPaths });
      }
    }),
  );

  return candidates;
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
  themeTokens: DesignTokens,
  path: string,
  groupPaths: string[],
  seen: Set<string> = new Set(),
): string | null {
  if (seen.has(path)) {
    return null;
  }
  seen.add(path);

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
  themeTokens: DesignTokens,
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
