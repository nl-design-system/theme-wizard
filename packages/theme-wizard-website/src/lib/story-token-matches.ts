// Prototype: find stories whose editable tokens resolve (in the live theme) to a
// `{basis.color.<group>...}` reference, so we can render "which stories use this basis color" lists.
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

export type StoryMatch = {
  componentId: keyof typeof components;
  id: string;
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

// A basis color reference looks like `basis.color.<group>` or `basis.color.<group>.<rest>`.
function referencesGroup(ref: string, groupName: string): boolean {
  const parts = ref.split('.');
  return parts[0] === 'basis' && parts[1] === 'color' && parts[2] === groupName;
}

// Refs can chain (e.g. nl.link.color -> basis.color.action-2.color-default -> basis.color.accent-1.color-default),
// so follow the chain until we find a match, a dead end, or a cycle.
function resolvesToGroup(
  themeTokens: Record<PropertyKey, unknown>,
  path: string,
  groupNames: string[],
  seen: Set<string> = new Set(),
): boolean {
  if (seen.has(path)) return false;
  seen.add(path);

  const token = dlv(themeTokens, path) as { $value?: unknown } | undefined;
  const value = token?.$value;
  if (!isRef(value)) return false;

  const ref = extractRef(value);
  if (groupNames.some((groupName) => referencesGroup(ref, groupName))) return true;

  return resolvesToGroup(themeTokens, ref, groupNames, seen);
}

// `highlight` should also match stories using `highlight-inverse`, etc.
function withInverseGroups(groupNames: string[]): string[] {
  return groupNames.flatMap((groupName) => [groupName, `${groupName}-inverse`]);
}

export async function findMatchingStories(
  groupNames: string[],
  themeTokens: Record<PropertyKey, unknown>,
): Promise<StoryMatch[]> {
  const matches: StoryMatch[] = [];
  const expandedGroupNames = withInverseGroups(groupNames);

  await Promise.all(
    Object.entries(components).map(async ([componentId, { stories }]) => {
      const componentModule = await stories();
      const { default: meta, ...storyExports } = componentModule;
      const storyList = getStories(storyExports as unknown as Record<PropertyKey, StoryObject>, meta);

      for (const [id, story] of storyList) {
        const editableTokens = story.parameters?.editableTokens;
        if (!editableTokens) continue;

        const isMatch = getEditableTokenPaths(editableTokens).some((path) =>
          resolvesToGroup(themeTokens, path, expandedGroupNames),
        );

        if (isMatch) {
          matches.push({ componentId: componentId as keyof typeof components, id, meta, story });
        }
      }
    }),
  );

  return matches;
}
