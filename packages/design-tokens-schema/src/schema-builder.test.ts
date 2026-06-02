import { describe, expect, it } from 'vitest';
import { buildSchema, EXTENSION_CSS_PROPERTY_SYNTAX } from './schema-builder';
import { BaseDesignTokenSchema } from './tokens/base-token';
import { ColorTokenValidationSchema } from './tokens/color-token';
import { DimensionTokenSchema } from './tokens/dimension-token';
import { FontFamilyTokenSchema } from './tokens/fontfamily-token';

const BASE_TOKEN = { $type: 'anything', $value: 'anything' };

const withModernSyntax = (syntax: unknown) => ({
  ...BASE_TOKEN,
  $extensions: { [EXTENSION_CSS_PROPERTY_SYNTAX]: syntax },
});

const withLegacySyntax = (syntax: unknown) => ({
  ...BASE_TOKEN,
  extensions: { [EXTENSION_CSS_PROPERTY_SYNTAX]: syntax },
});

describe('buildSchema', () => {
  describe('token node (has $type)', () => {
    describe('modern $extensions syntax', () => {
      it('returns ColorTokenValidationSchema for <color>', () => {
        expect(buildSchema(withModernSyntax('<color>'))).toBe(ColorTokenValidationSchema);
      });

      it('returns DimensionTokenSchema for <length>', () => {
        expect(buildSchema(withModernSyntax('<length>'))).toBe(DimensionTokenSchema);
      });

      it('returns DimensionTokenSchema for <length-percentage>', () => {
        expect(buildSchema(withModernSyntax('<length-percentage>'))).toBe(DimensionTokenSchema);
      });

      it('returns DimensionTokenSchema for ["<length>"]', () => {
        expect(buildSchema(withModernSyntax('["<length>"]'))).toBe(DimensionTokenSchema);
      });

      it('returns FontFamilyTokenSchema for ["<family-name>", "<generic-name>"]', () => {
        expect(buildSchema(withModernSyntax('["<family-name>", "<generic-name>"]'))).toBe(FontFamilyTokenSchema);
      });

      it('returns BaseDesignTokenSchema for <line-style>', () => {
        expect(buildSchema(withModernSyntax('<line-style>'))).toBe(BaseDesignTokenSchema);
      });

      it('returns BaseDesignTokenSchema for <number>', () => {
        expect(buildSchema(withModernSyntax('<number>'))).toBe(BaseDesignTokenSchema);
      });

      it('returns BaseDesignTokenSchema for ["<cursor-image>", "<cursor-predefined>"]', () => {
        expect(buildSchema(withModernSyntax('["<cursor-image>", "<cursor-predefined>"]'))).toBe(BaseDesignTokenSchema);
      });

      it('returns BaseDesignTokenSchema for ["<spread-shadow>"]', () => {
        expect(buildSchema(withModernSyntax('["<spread-shadow>"]'))).toBe(BaseDesignTokenSchema);
      });
    });

    describe('legacy extensions syntax', () => {
      it('falls back to legacy extensions when modern $extensions is absent', () => {
        expect(buildSchema(withLegacySyntax('<color>'))).toBe(ColorTokenValidationSchema);
      });

      it('falls back to legacy extensions for dimension tokens', () => {
        expect(buildSchema(withLegacySyntax('<length>'))).toBe(DimensionTokenSchema);
      });
    });

    describe('missing or unknown css-syntax', () => {
      it('returns BaseDesignTokenSchema when no extensions present', () => {
        expect(buildSchema(BASE_TOKEN)).toBe(BaseDesignTokenSchema);
      });

      it('returns BaseDesignTokenSchema when syntax is not a string', () => {
        expect(buildSchema(withModernSyntax(42))).toBe(BaseDesignTokenSchema);
      });

      it('returns BaseDesignTokenSchema when syntax is an unknown string', () => {
        expect(buildSchema(withModernSyntax('<unknown-syntax>'))).toBe(BaseDesignTokenSchema);
      });
    });
  });

  describe('group node (no $type)', () => {
    it('returns strict schema for empty group', () => {
      const schema = buildSchema({});
      expect(schema.safeParse({}).success).toBe(true);
      expect(schema.safeParse({ unexpected: 'key' }).success).toBe(false);
    });

    it('includes non-$ keys as nested schemas', () => {
      const schema = buildSchema({ 'my-token': BASE_TOKEN });
      expect(schema.safeParse({ 'my-token': BASE_TOKEN }).success).toBe(true);
    });

    it('skips $ keys — they do not appear in the strict schema shape', () => {
      const schema = buildSchema({ $meta: 'skip-me', 'my-token': BASE_TOKEN });
      expect(schema.safeParse({ 'my-token': BASE_TOKEN }).success).toBe(true);
      expect(schema.safeParse({ $meta: 'skip-me', 'my-token': BASE_TOKEN }).success).toBe(false);
    });

    it('recursively builds schemas for nested groups', () => {
      const schema = buildSchema({ group: { 'my-token': BASE_TOKEN } });
      expect(schema.safeParse({ group: { 'my-token': BASE_TOKEN } }).success).toBe(true);
      expect(schema.safeParse({ group: { extra: 'fail', 'my-token': BASE_TOKEN } }).success).toBe(false);
    });
  });
});
