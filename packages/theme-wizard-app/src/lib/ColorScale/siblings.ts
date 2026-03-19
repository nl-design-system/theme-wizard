import { extractRef, isRef, isTokenGroup } from '@nl-design-system-community/design-tokens-schema';

/**
 * Given a color scale group path (e.g. 'basis.color.accent-1') and its parent group object
 * (e.g. the 'basis.color' group), returns the paths of sibling groups whose every token is
 * a reference into the target group (e.g. 'basis.color.accent-2' → [{basis.color.accent-2.color-default}, ...]).
 *
 * Used to propagate the colorscale seed extension to groups that "follow" the updated scale.
 *
 * @example
 * const parentGroup = {
 *   'accent-1': {
 *     'bg-document': { $type: 'color', $value: '#ffffff' },
 *     'color-default': { $type: 'color', $value: '#000000' },
 *   },
 *   'accent-2': {
 *     'bg-document': { $type: 'color', $value: '{basis.color.accent-1.bg-document}' },
 *     'color-default': { $type: 'color', $value: '{basis.color.accent-1.color-default}' },
 *   },
 *   'accent-3': {
 *     'bg-document': { $type: 'color', $value: '#ff0000' },
 *     'color-default': { $type: 'color', $value: '#00ff00' },
 *   },
 * };
 * getSiblingGroupsWithOnlyRefsTo('basis.color.accent-1', parentGroup);
 * // → ['basis.color.accent-2']
 */
export function getSiblingGroupsWithOnlyRefsTo(groupPath: string, parentGroup: unknown): string[] {
  if (!parentGroup || typeof parentGroup !== 'object') return [];

  const selfKey = groupPath.split('.').at(-1);
  const parentPath = groupPath.split('.').slice(0, -1).join('.');

  return Object.entries(parentGroup)
    .filter(([siblingKey, siblingGroup]) => {
      if (siblingKey === selfKey || !isTokenGroup(siblingGroup)) return false;
      // Every token in the sibling must reference this group, e.g. {basis.color.accent-1.bg-default}
      return (
        Object.entries(siblingGroup)
          .filter(([k]) => !k.startsWith('$')) // skip group-level $type, $extensions, etc.
          // Check that every token's value is a ref starting with groupPath
          .every(([, token]) => isRef(token.$value) && extractRef(token.$value).startsWith(groupPath))
      );
    })
    .map(([siblingKey]) => `${parentPath}.${siblingKey}`);
}
