import { BaseDesignToken, EXTENSION_TOKEN_SUBTYPE } from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { describe, expect, it } from 'vitest';
import {
  getTokenColor,
  getTokenDimensionSpaceConcept,
  getTokenPath,
  getTokenReferenceCount,
  getTokenReferencedAt,
} from './index';

const tokenFullFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'path.to.token',
    'nl.nldesignsystem.reference-count': 1,
    'nl.nldesignsystem.referenced-at': ['path.to.another.token'],
    'nl.nldesignsystem.token-subtype': 'border-color',
  },
  $type: 'color',
  $value: '#ff0000',
};

export const tokenSpacingFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'path.to.token',
    'nl.nldesignsystem.token-subtype': 'space-inline',
  },
  $type: 'dimension',
  $value: '64px',
};

describe('getTokenPath', () => {
  it('should return token path from extension', () => {
    const result = getTokenPath(tokenFullFixture);
    expect(result).toBe('path.to.token');
  });

  it('should return empty string for token without path', () => {
    const result = getTokenPath({
      ...tokenFullFixture,
      $extensions: {
        ...tokenFullFixture.$extensions,
        'nl.nldesignsystem.path': undefined,
      },
    });
    expect(result).toBe('');
  });
});

describe('getTokenReferencedAt', () => {
  it('should return an array of referenced-at paths', () => {
    const result = getTokenReferencedAt(tokenFullFixture);
    expect(result).toEqual(['path.to.another.token']);
  });

  it('should return empty array for token without referenced-at', () => {
    const result = getTokenReferencedAt({
      ...tokenFullFixture,
      $extensions: {
        ...tokenFullFixture.$extensions,
        'nl.nldesignsystem.referenced-at': undefined,
      },
    });
    expect(result).toEqual([]);
  });
});

describe('getTokenReferenceCount', () => {
  it('should return reference count from extension', () => {
    const result = getTokenReferenceCount(tokenFullFixture);
    expect(result).toBe(1);
  });

  it('should return 0 for token without reference count', () => {
    const result = getTokenReferenceCount({
      ...tokenFullFixture,
      $extensions: {
        ...tokenFullFixture.$extensions,
        'nl.nldesignsystem.reference-count': undefined,
      },
    });
    expect(result).toBe(0);
  });
});

describe('getTokenColor', () => {
  it('should return a Color.js Color from extension', () => {
    const result = getTokenColor(tokenFullFixture);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Color);
  });

  it('should return undefined for token without color type', () => {
    const result = getTokenColor(tokenSpacingFixture);
    expect(result).toBeUndefined();
  });
});

describe('getTokenDimensionSpaceConcept', () => {
  it('should return dimension space concept from extension', () => {
    const result = getTokenDimensionSpaceConcept(tokenSpacingFixture);
    expect(result).toBe('inline');
  });

  it('should return empty string for token without dimension space subtype', () => {
    const result = getTokenDimensionSpaceConcept({
      ...tokenSpacingFixture,
      $extensions: {
        ...tokenSpacingFixture.$extensions,
        [EXTENSION_TOKEN_SUBTYPE]: undefined,
      },
    });
    expect(result).toBe('');
  });
});
