import { describe, expect, it } from 'vitest';
import { EXTENSION_COLORSCALE_SEED } from '../../components/wizard-colorscale-input';
import { getSiblingGroupsWithOnlyRefsTo } from './siblings';

const GROUP_PATH = 'basis.color.accent-1';

// A minimal token group where every token references basis.color.accent-1
const followerGroup = {
  'bg-document': { $type: 'color', $value: '{basis.color.accent-1.bg-document}' },
  'border-subtle': { $type: 'color', $value: '{basis.color.accent-1.border-subtle}' },
  'color-default': { $type: 'color', $value: '{basis.color.accent-1.color-default}' },
};

// A group with mixed references — one points elsewhere
const mixedGroup = {
  'bg-document': { $type: 'color', $value: '{basis.color.accent-1.bg-document}' },
  'color-default': { $type: 'color', $value: '{basis.color.accent-2.color-default}' },
};

// A group with actual values, not references
const hardcodedGroup = {
  'bg-document': { $type: 'color', $value: '#ffffff' },
  'color-default': { $type: 'color', $value: '#000000' },
};

describe('getSiblingGroupsWithOnlyRefsTo', () => {
  it('returns empty array when parentGroup is null', () => {
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, null)).toEqual([]);
  });

  it('returns empty array when parentGroup is not an object', () => {
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, 'string')).toEqual([]);
  });

  it('returns empty array when there are no siblings', () => {
    const parentGroup = { 'accent-1': followerGroup };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual([]);
  });

  it('returns sibling path when all tokens reference the target group', () => {
    const parentGroup = {
      'accent-1': hardcodedGroup,
      'accent-2': followerGroup,
    };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual(['basis.color.accent-2']);
  });

  it('ignores siblings with mixed references', () => {
    const parentGroup = {
      'accent-1': hardcodedGroup,
      'action-1': mixedGroup,
    };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual([]);
  });

  it('ignores siblings with hardcoded values', () => {
    const parentGroup = {
      'accent-1': hardcodedGroup,
      'accent-2': hardcodedGroup,
    };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual([]);
  });

  it('still finds followers on second call when sibling already has $extensions', () => {
    const siblingWithExtensions = {
      ...followerGroup,
      $extensions: { [EXTENSION_COLORSCALE_SEED]: { colorSpace: 'srgb' } },
    };
    const parentGroup = {
      'accent-1': hardcodedGroup,
      'accent-1-inverse': siblingWithExtensions,
    };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual(['basis.color.accent-1-inverse']);
  });

  it('returns multiple sibling paths when several qualify', () => {
    const parentGroup = {
      'accent-1': hardcodedGroup,
      'accent-2': hardcodedGroup,
      'accent-3': followerGroup,
      'action-1': followerGroup,
    };
    expect(getSiblingGroupsWithOnlyRefsTo(GROUP_PATH, parentGroup)).toEqual([
      'basis.color.accent-3',
      'basis.color.action-1',
    ]);
  });
});
