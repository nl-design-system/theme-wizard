import { it, describe, expect } from 'vitest';
import { removeExtensions, type RemoveExtensionsOptions } from './remove-extensions';

describe('remove all extensions', () => {
  it('removes $extensions from a single token', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens);
    expect(tokens.color.red).not.toHaveProperty('$extensions');
  });

  it('removes $extensions from nested tokens', () => {
    const tokens = {
      color: {
        blue: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#0000ff',
        },
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
      size: {
        small: {
          $extensions: { 'sub-type': 'spacing' },
          $type: 'dimension',
          $value: { unit: 'px', value: 4 },
        },
      },
    };
    removeExtensions(tokens);
    expect(tokens.color.red).not.toHaveProperty('$extensions');
    expect(tokens.color.blue).not.toHaveProperty('$extensions');
    expect(tokens.size.small).not.toHaveProperty('$extensions');
  });

  it('does nothing when a token has no $extensions', () => {
    const tokens = {
      color: {
        red: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens);
    expect(tokens.color.red).not.toHaveProperty('$extensions');
    expect(tokens.color.red.$type).toEqual('color');
  });

  it('is idempotent', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens);
    removeExtensions(tokens);
    expect(tokens.color.red).not.toHaveProperty('$extensions');
  });
});

describe('remove specific extensions (only)', () => {
  it('removes only the specified extension key', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { only: ['sub-type'] });
    expect(tokens.color.red.$extensions).toEqual({ 'contrast-with': ['blue'] });
  });

  it('removes multiple specified extension keys', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], other: 'keep', 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { only: ['sub-type', 'contrast-with'] });
    expect(tokens.color.red.$extensions).toEqual({ other: 'keep' });
  });

  it('drops $extensions entirely once it becomes empty', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { only: ['sub-type'] });
    expect(tokens.color.red).not.toHaveProperty('$extensions');
  });

  it('ignores extension keys that are not present', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { only: ['does-not-exist'] });
    expect(tokens.color.red.$extensions).toEqual({ 'sub-type': 'brand' });
  });

  it('is idempotent', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { only: ['sub-type'] });
    removeExtensions(tokens, { only: ['sub-type'] });
    expect(tokens.color.red.$extensions).toEqual({ 'contrast-with': ['blue'] });
  });
});

describe('keep specific extensions (skip removal)', () => {
  it('keeps the specified extension key and removes the rest', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { keep: ['sub-type'] });
    expect(tokens.color.red.$extensions).toEqual({ 'sub-type': 'brand' });
  });

  it('keeps multiple specified extension keys', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], other: 'remove-me', 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { keep: ['sub-type', 'contrast-with'] });
    expect(tokens.color.red.$extensions).toEqual({ 'contrast-with': ['blue'], 'sub-type': 'brand' });
  });

  it('drops $extensions entirely when nothing is kept', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { keep: ['does-not-exist'] });
    expect(tokens.color.red).not.toHaveProperty('$extensions');
  });

  it('is idempotent', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { keep: ['sub-type'] });
    removeExtensions(tokens, { keep: ['sub-type'] });
    expect(tokens.color.red.$extensions).toEqual({ 'sub-type': 'brand' });
  });
});

describe('both keep and only given (type-unsafe caller)', () => {
  it('keep wins and only is ignored when the two do not overlap', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], other: 'drop-me', 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, {
      keep: ['sub-type'],
      only: ['contrast-with'],
    } as unknown as RemoveExtensionsOptions);
    expect(tokens.color.red.$extensions).toEqual({ 'sub-type': 'brand' });
  });

  it('keep wins and only is ignored when the same key is listed in both', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, {
      keep: ['sub-type'],
      only: ['sub-type'],
    } as unknown as RemoveExtensionsOptions);
    expect(tokens.color.red.$extensions).toEqual({ 'sub-type': 'brand' });
  });

  it('drops $extensions entirely when keep is empty, ignoring only', () => {
    const tokens = {
      color: {
        red: {
          $extensions: { 'contrast-with': ['blue'], 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    removeExtensions(tokens, { keep: [], only: ['contrast-with'] } as unknown as RemoveExtensionsOptions);
    expect(tokens.color.red).not.toHaveProperty('$extensions');
  });
});
