import { it, describe, expect } from 'vitest';
import { removeExtensions } from './remove-extensions';

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

describe('remove specific extensions', () => {
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
    removeExtensions(tokens, ['sub-type']);
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
    removeExtensions(tokens, ['sub-type', 'contrast-with']);
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
    removeExtensions(tokens, ['sub-type']);
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
    removeExtensions(tokens, ['does-not-exist']);
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
    removeExtensions(tokens, ['sub-type']);
    removeExtensions(tokens, ['sub-type']);
    expect(tokens.color.red.$extensions).toEqual({ 'contrast-with': ['blue'] });
  });
});
