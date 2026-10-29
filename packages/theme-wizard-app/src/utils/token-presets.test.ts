import { describe, it, expect } from 'vitest';
import { TOKEN_PRESET_FOLDERS, getRelevantPresetFolders, presetMatchesPath } from './token-presets';

const preset = {
  ams: {
    'page-header': {
      'background-color': { $type: 'color', $value: '{basis.color.accent-1.bg-document}' },
    },
  },
};

describe('presetMatchesPath', () => {
  it('matches a token the preset sets', () => {
    expect(presetMatchesPath(preset, 'ams.page-header.background-color')).toBe(true);
  });

  it('matches a group containing a token the preset sets', () => {
    expect(presetMatchesPath(preset, 'ams.page-header')).toBe(true);
  });

  it('matches a token the preset references', () => {
    expect(presetMatchesPath(preset, 'basis.color.accent-1.bg-document')).toBe(true);
  });

  it('matches a group containing a token the preset references', () => {
    expect(presetMatchesPath(preset, 'basis.color.accent-1')).toBe(true);
  });

  it('does not match a sibling group with a shared prefix', () => {
    expect(presetMatchesPath(preset, 'basis.color.accent-1-inverse')).toBe(false);
  });

  it('does not match unrelated paths', () => {
    expect(presetMatchesPath(preset, 'basis.color.action-2')).toBe(false);
  });
});

describe('TOKEN_PRESET_FOLDERS', () => {
  it('groups preset files by folder', () => {
    const folders = TOKEN_PRESET_FOLDERS.map(({ folder }) => folder);
    expect(folders).toEqual(expect.arrayContaining(['ams.page-header', 'nl.link']));
  });
});

describe('getRelevantPresetFolders', () => {
  it('returns only folders with a matching preset', () => {
    const folders = getRelevantPresetFolders('basis.color.action-2').map(({ folder }) => folder);
    expect(folders).toEqual(['nl.link']);
  });
});
