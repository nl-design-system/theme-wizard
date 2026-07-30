// Prototype: find stories whose editable tokens resolve (in the live theme) to a
// `{basis.<group-path>...}` reference, so we can render "which stories use this basis token" lists.
import { isRef, extractRef } from '@nl-design-system-community/design-tokens-schema';
import { getStories } from '@nl-design-system-community/theme-wizard-app/utils';
import dlv from 'dlv';
import { Traverse } from 'neotraverse/modern';
import { components } from '@/lib/components';

type StoryObject = {
  name?: string;
  args?: unknown;
  render?: unknown;
  parameters?: {
    editableTokens?: unknown;
    [key: PropertyKey]: unknown;
  };
  [key: PropertyKey]: unknown;
};

export type MatchedToken = {
  // Path of the component's own token, e.g. `nl.link.hover.color`.
  path: string;
  // The basis ref that satisfied the match, e.g. `basis.color.accent-1.color-hover`.
  ref: string;
};

export type StoryMatch = {
  componentId: keyof typeof components;
  id: string;
  matchedTokens: MatchedToken[];
  meta: unknown;
  story: StoryObject;
};

function getEditableTokenPaths(editableTokens: unknown): string[] {
  const paths: string[] = [];
  new Traverse(editableTokens).forEach((ctx, node) => {
    if (ctx.isLeaf) {
      paths.push(ctx.path.slice(0, -1).join('.'));
    }
  });
  return paths;
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
  themeTokens: Record<PropertyKey, unknown>,
  path: string,
  groupPaths: string[],
  seen: Set<string> = new Set(),
): string | null {
  if (seen.has(path)) return null;
  seen.add(path);

  const token = dlv(themeTokens, path) as { $value?: unknown } | undefined;
  const value = token?.$value;
  if (!isRef(value)) return null;

  const ref = extractRef(value);
  if (groupPaths.some((groupPath) => referencesGroup(ref, groupPath))) return ref;

  return resolveMatchingRef(themeTokens, ref, groupPaths, seen);
}

export async function findMatchingStories(
  groupPaths: string[],
  themeTokens: Record<PropertyKey, unknown>,
): Promise<StoryMatch[]> {
  const matches: StoryMatch[] = [];

  await Promise.all(
    Object.entries(components).map(async ([componentId, { stories }]) => {
      const componentModule = await stories();
      const { default: meta, ...storyExports } = componentModule;
      const storyList = getStories(storyExports as unknown as Record<PropertyKey, StoryObject>, meta);

      for (const [id, story] of storyList) {
        const editableTokens = story.parameters?.editableTokens;
        if (!editableTokens) continue;

        const matchedTokens: MatchedToken[] = getEditableTokenPaths(editableTokens)
          .map((path) => ({ path, ref: resolveMatchingRef(themeTokens, path, groupPaths) }))
          .filter((entry): entry is MatchedToken => entry.ref !== null);

        if (matchedTokens.length > 0) {
          matches.push({ componentId: componentId as keyof typeof components, id, matchedTokens, meta, story });
        }
      }
    }),
  );

  return matches;
}
