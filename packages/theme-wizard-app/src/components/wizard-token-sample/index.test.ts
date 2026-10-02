import { EXTENSION_COLORSCALE_SEED, type TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it } from 'vitest';
import type Theme from '../../lib/Theme';
import { getColorGroupSample, WizardTokenSample } from '.';

const colorToken = (hex: string) => ({ $type: 'color', $value: { hex } });

describe('getColorGroupSample', () => {
  it('prefers the colorscale seed color over any other fallback', () => {
    const group: TokenGroup = {
      $extensions: { [EXTENSION_COLORSCALE_SEED]: { hex: '#ff0000' } },
      $type: 'color',
      'bg-default': colorToken('#000000'),
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1')).toEqual({
      $type: 'color',
      $value: { hex: '#ff0000' },
    });
  });

  it('falls back to bg-default when the path is an -inverse variant', () => {
    const group: TokenGroup = {
      $type: 'color',
      'bg-default': colorToken('#000000'),
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1-inverse')).toEqual(colorToken('#000000'));
  });

  it('falls back to color-default when the path is not an -inverse variant', () => {
    const group: TokenGroup = {
      $type: 'color',
      'bg-default': colorToken('#000000'),
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1')).toEqual(colorToken('#ffffff'));
  });

  it('falls back to color-default on an -inverse path when bg-default is missing', () => {
    const group: TokenGroup = {
      $type: 'color',
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1-inverse')).toEqual(colorToken('#ffffff'));
  });

  it('ignores bg-default on a non-inverse path', () => {
    const group: TokenGroup = {
      $type: 'color',
      'bg-default': colorToken('#000000'),
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1')).not.toEqual(colorToken('#000000'));
  });

  it('ignores a bg-default that is not a valid color token', () => {
    const group: TokenGroup = {
      $type: 'color',
      'bg-default': { not: 'a color token' } as unknown as TokenGroup,
      'color-default': colorToken('#ffffff'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1-inverse')).toEqual(colorToken('#ffffff'));
  });

  it('falls back to the single token in the group when no other fallback matches', () => {
    // Mirrors a real-world group like `basis.form.control.placeholder`
    const group: TokenGroup = {
      $type: 'color',
      'placeholder-color': colorToken('#808080'),
    };

    expect(getColorGroupSample(group, 'basis.form.control.placeholder')).toEqual(colorToken('#808080'));
  });

  it('returns undefined when there is no seed, no fallback, and multiple tokens in the group', () => {
    const group: TokenGroup = {
      $type: 'color',
      'token-a': colorToken('#111111'),
      'token-b': colorToken('#222222'),
    };

    expect(getColorGroupSample(group, 'basis.color.accent-1')).toBeUndefined();
  });

  it('returns undefined for an empty group', () => {
    const group: TokenGroup = { $type: 'color' };

    expect(getColorGroupSample(group, 'basis.color.accent-1')).toBeUndefined();
  });
});

const tag = 'wizard-token-sample';

const mount = async (path: string, theme: Partial<Theme>): Promise<WizardTokenSample> => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector<WizardTokenSample>(tag)!;
  el.path = path;
  (el as unknown as { theme: Theme }).theme = theme as Theme;
  await el.updateComplete;
  return el;
};

const getSampledToken = (el: WizardTokenSample) => el.shadowRoot?.querySelector('clippy-token-sample')?.token;

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('passes a plain token through as-is', async () => {
    const token = colorToken('#123456');
    const el = await mount('basis.color.accent-1.color-default', {
      at: () => token,
    });

    expect(getSampledToken(el)).toEqual(token);
  });

  it('resolves the seed color for a color token group', async () => {
    const group = {
      $extensions: { [EXTENSION_COLORSCALE_SEED]: { hex: '#ff0000' } },
      $type: 'color',
    };
    const el = await mount('basis.color.accent-1', {
      at: () => group as never,
    });

    expect(getSampledToken(el)).toEqual({ $type: 'color', $value: { hex: '#ff0000' } });
  });

  it('resolves the inverse fallback for a color token group on an -inverse path', async () => {
    const group = {
      $type: 'color',
      'bg-default': colorToken('#000000'),
    };
    const el = await mount('basis.color.accent-1-inverse', {
      at: () => group as never,
    });

    expect(getSampledToken(el)).toEqual(colorToken('#000000'));
  });

  it('returns no sample for a non-color token group', async () => {
    const group = {
      $type: 'dimension',
      'some-dimension': { $type: 'dimension', $value: { unit: 'px', value: 4 } },
    };
    const el = await mount('basis.spacing', {
      at: () => group as never,
    });

    expect(getSampledToken(el)).toBeUndefined();
  });

  it('returns no sample when the path resolves to nothing', async () => {
    const el = await mount('does.not.exist', {
      at: () => undefined as never,
    });

    expect(getSampledToken(el)).toBeUndefined();
  });
});
