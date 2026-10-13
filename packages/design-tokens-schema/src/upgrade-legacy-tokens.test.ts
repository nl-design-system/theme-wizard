import { describe, it, expect } from 'vitest';
import { upgradeLegacyTokens } from './upgrade-legacy-tokens';

describe('boxShadow', () => {
  it('upgrades a legacy drop shadow to a DTCG shadow token', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: '16',
            color: '#00000040',
            spread: '0',
            type: 'dropShadow',
            x: '0',
            y: '8',
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'px', value: 16 },
            color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
            offsetX: { unit: 'px', value: 0 },
            offsetY: { unit: 'px', value: 8 },
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('upgrades a legacy inner shadow and sets inset to true', () => {
    const config = {
      shadow: {
        inner: {
          $type: 'boxShadow',
          $value: {
            blur: '4',
            color: '#000000ff',
            spread: '0',
            type: 'innerShadow',
            x: '2',
            y: '2',
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        inner: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'px', value: 4 },
            color: { alpha: 1, colorSpace: 'srgb', components: [0, 0, 0] },
            inset: true,
            offsetX: { unit: 'px', value: 2 },
            offsetY: { unit: 'px', value: 2 },
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('leaves a color reference untouched', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: '16',
            color: '{rhc.color.cool-grey.500}',
            spread: '0',
            type: 'dropShadow',
            x: '0',
            y: '8',
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'px', value: 16 },
            color: '{rhc.color.cool-grey.500}',
            offsetX: { unit: 'px', value: 0 },
            offsetY: { unit: 'px', value: 8 },
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('leaves offset/blur/spread refs untouched', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: '{basis.spacing.sm}',
            color: '#00000040',
            spread: '0',
            type: 'dropShadow',
            x: '0',
            y: '{basis.spacing.sm}',
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: '{basis.spacing.sm}',
            color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
            offsetX: { unit: 'px', value: 0 },
            offsetY: '{basis.spacing.sm}',
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('handles numeric (not stringified) offsets', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: 16,
            color: '#00000040',
            spread: 0,
            type: 'dropShadow',
            x: 0,
            y: 8,
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'px', value: 16 },
            color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
            offsetX: { unit: 'px', value: 0 },
            offsetY: { unit: 'px', value: 8 },
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('respects an explicit rem unit', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: '1.5rem',
            color: '#00000040',
            spread: '0rem',
            type: 'dropShadow',
            x: '0rem',
            y: '0.5rem',
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'rem', value: 1.5 },
            color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
            offsetX: { unit: 'rem', value: 0 },
            offsetY: { unit: 'rem', value: 0.5 },
            spread: { unit: 'rem', value: 0 },
          },
        },
      },
    });
  });

  it('upgrades a layered shadow (an array of legacy shadow objects)', () => {
    const config = {
      shadow: {
        layered: {
          $type: 'boxShadow',
          $value: [
            {
              blur: '22',
              color: 'rgba(0, 0, 0, 0.1)',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '24',
            },
            {
              blur: '44',
              color: 'rgba(0, 0, 0, 0.2)',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '42',
            },
          ],
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        layered: {
          $type: 'shadow',
          $value: [
            {
              blur: { unit: 'px', value: 22 },
              color: { alpha: 0.1, colorSpace: 'srgb', components: [0, 0, 0] },
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 24 },
              spread: { unit: 'px', value: 0 },
            },
            {
              blur: { unit: 'px', value: 44 },
              color: { alpha: 0.2, colorSpace: 'srgb', components: [0, 0, 0] },
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 42 },
              spread: { unit: 'px', value: 0 },
            },
          ],
        },
      },
    });
  });

  it('leaves a shadow-token reference inside a layered array untouched', () => {
    const config = {
      shadow: {
        layered: {
          $type: 'boxShadow',
          $value: [
            '{basis.shadow.sm}',
            {
              blur: '4',
              color: '#00000040',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '2',
            },
          ],
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        layered: {
          $type: 'shadow',
          $value: [
            '{basis.shadow.sm}',
            {
              blur: { unit: 'px', value: 4 },
              color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 2 },
              spread: { unit: 'px', value: 0 },
            },
          ],
        },
      },
    });
  });

  it('leaves a full-token reference untouched', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: '{basis.shadow.default}',
        },
      },
    };

    const result = upgradeLegacyTokens(config);
    expect(result).toEqual(config);
  });

  it('leaves an already-DTCG-shaped shadow value untouched', () => {
    const config = {
      shadow: {
        sm: {
          $type: 'boxShadow',
          $value: {
            blur: { unit: 'rem', value: 1.5 },
            color: { alpha: 0.5, colorSpace: 'srgb', components: [0, 0, 0] },
            offsetX: { unit: 'rem', value: 0.5 },
            offsetY: { unit: 'rem', value: 0.5 },
            spread: { unit: 'rem', value: 0 },
          },
        },
      },
    };

    const result = upgradeLegacyTokens(config);
    expect(result).toEqual(config);
  });

  describe('malformed input', () => {
    it('does not throw and leaves a raw CSS box-shadow string as-is', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: '0px 0px 2px 0px rgb(0 0 0 / 20%)',
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual(config);
    });

    it('does not throw and leaves a comma-separated multi-shadow CSS string as-is', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: '0px 1px 2px rgba(0, 0, 0, 0.2), 0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual(config);
    });

    it('does not throw when $value is null', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: null,
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual(config);
    });

    it('does not throw when a shadow is missing the color property', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              blur: '16',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '8',
            },
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {
              blur: { unit: 'px', value: 16 },
              color: undefined,
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 8 },
              spread: { unit: 'px', value: 0 },
            },
          },
        },
      });
    });

    it('does not throw when a shadow is missing blur, spread and color', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              type: 'dropShadow',
              x: '0',
              y: '8',
            },
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {
              blur: undefined,
              color: undefined,
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 8 },
              spread: undefined,
            },
          },
        },
      });
    });

    it('leaves a shadow object untouched when it has no x property at all', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              blur: '16',
              color: '#00000040',
              spread: '0',
              type: 'dropShadow',
              y: '8',
            },
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {
              blur: '16',
              color: '#00000040',
              spread: '0',
              type: 'dropShadow',
              y: '8',
            },
          },
        },
      });
    });

    it('leaves an unparsable color string as-is', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              blur: '16',
              color: 'not-a-real-color',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '8',
            },
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {
              blur: { unit: 'px', value: 16 },
              color: 'not-a-real-color',
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 8 },
              spread: { unit: 'px', value: 0 },
            },
          },
        },
      });
    });

    it('leaves an unparsable dimension string as-is', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              blur: 'not-a-dimension',
              color: '#00000040',
              spread: '0',
              type: 'dropShadow',
              x: '0',
              y: '8',
            },
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {
              blur: 'not-a-dimension',
              color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
              offsetX: { unit: 'px', value: 0 },
              offsetY: { unit: 'px', value: 8 },
              spread: { unit: 'px', value: 0 },
            },
          },
        },
      });
    });

    it('does not throw on an empty $value object', () => {
      const config = {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {},
          },
        },
      };

      expect(() => upgradeLegacyTokens(config)).not.toThrow();

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          sm: {
            $type: 'shadow',
            $value: {},
          },
        },
      });
    });

    it('does not throw on a layered shadow containing a garbage entry', () => {
      const config = {
        shadow: {
          layered: {
            $type: 'boxShadow',
            $value: [
              null,
              {
                blur: '4',
                color: '#00000040',
                spread: '0',
                type: 'dropShadow',
                x: '0',
                y: '2',
              },
            ],
          },
        },
      };

      const result = upgradeLegacyTokens(config);

      expect(result).toEqual({
        shadow: {
          layered: {
            $type: 'shadow',
            $value: [
              null,
              {
                blur: { unit: 'px', value: 4 },
                color: { alpha: 0.25098039215686274, colorSpace: 'srgb', components: [0, 0, 0] },
                offsetX: { unit: 'px', value: 0 },
                offsetY: { unit: 'px', value: 2 },
                spread: { unit: 'px', value: 0 },
              },
            ],
          },
        },
      });
    });
  });
});

describe('legacy shadow group (sibling x/y/blur/spread/color tokens)', () => {
  it('upgrades a group of sibling tokens to a single DTCG shadow token', () => {
    const config = {
      shadow: {
        'box-inline-end-shadow': {
          blur: { $type: 'other', $value: '3rem' },
          color: { $type: 'color', $value: 'oklch(0% 0 none / 0.102)' },
          spread: { $type: 'other', $value: '0rem' },
          x: { $type: 'other', $value: '0rem' },
          y: { $type: 'other', $value: '1rem' },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        'box-inline-end-shadow': {
          $type: 'shadow',
          $value: {
            blur: { unit: 'rem', value: 3 },
            color: { alpha: 0.102, colorSpace: 'oklch', components: [0, 0, null] },
            offsetX: { unit: 'rem', value: 0 },
            offsetY: { unit: 'rem', value: 1 },
            spread: { unit: 'rem', value: 0 },
          },
        },
      },
    });
  });

  it('upgrades multiple sibling shadow groups independently', () => {
    const oldShadow = {
      blur: { $type: 'other', $value: '3rem' },
      color: { $type: 'color', $value: 'oklch(0% 0 none / 0.102)' },
      spread: { $type: 'other', $value: '0rem' },
      x: { $type: 'other', $value: '0rem' },
      y: { $type: 'other', $value: '1rem' },
    };
    const config = {
      shadow: {
        'box-inline-end-shadow': oldShadow,
        'box-inline-start-shadow': oldShadow,
      },
    };

    const result = upgradeLegacyTokens(config);

    const expectedShadow = {
      $type: 'shadow',
      $value: {
        blur: { unit: 'rem', value: 3 },
        color: { alpha: 0.102, colorSpace: 'oklch', components: [0, 0, null] },
        offsetX: { unit: 'rem', value: 0 },
        offsetY: { unit: 'rem', value: 1 },
        spread: { unit: 'rem', value: 0 },
      },
    };
    expect(result).toEqual({
      shadow: {
        'box-inline-end-shadow': expectedShadow,
        'box-inline-start-shadow': expectedShadow,
      },
    });
  });

  it('upgrades a group with a color reference and unitless numbers', () => {
    const config = {
      shadow: {
        sm: {
          blur: { $type: 'other', $value: 8 },
          color: { $type: 'color', $value: '{basis.color.shadow}' },
          spread: { $type: 'other', $value: 0 },
          x: { $type: 'other', $value: 0 },
          y: { $type: 'other', $value: 4 },
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          $type: 'shadow',
          $value: {
            blur: { unit: 'px', value: 8 },
            color: '{basis.color.shadow}',
            offsetX: { unit: 'px', value: 0 },
            offsetY: { unit: 'px', value: 4 },
            spread: { unit: 'px', value: 0 },
          },
        },
      },
    });
  });

  it('leaves the group shape untouched when it is missing one of the five sibling tokens', () => {
    // Note: the standalone `color` token still gets upgraded independently by the regular
    // color-token upgrade path - only the group-merge into a single shadow token is skipped.
    const config = {
      shadow: {
        sm: {
          blur: { $type: 'other', $value: '3rem' },
          color: { $type: 'color', $value: 'oklch(0% 0 none / 0.102)' },
          spread: { $type: 'other', $value: '0rem' },
          x: { $type: 'other', $value: '0rem' },
          // no `y`
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          blur: { $type: 'other', $value: '3rem' },
          color: { $type: 'color', $value: { alpha: 0.102, colorSpace: 'oklch', components: [0, 0, null] } },
          spread: { $type: 'other', $value: '0rem' },
          x: { $type: 'other', $value: '0rem' },
        },
      },
    });
  });

  it('does not merge a group where a sibling looks like a token but has the wrong shape', () => {
    const config = {
      shadow: {
        sm: {
          blur: { $type: 'other', $value: '3rem' },
          color: { $type: 'color', $value: 'oklch(0% 0 none / 0.102)' },
          spread: { $type: 'other', $value: '0rem' },
          x: { $type: 'other', $value: '0rem' },
          y: 'not-a-token',
        },
      },
    };

    const result = upgradeLegacyTokens(config);

    expect(result).toEqual({
      shadow: {
        sm: {
          blur: { $type: 'other', $value: '3rem' },
          color: { $type: 'color', $value: { alpha: 0.102, colorSpace: 'oklch', components: [0, 0, null] } },
          spread: { $type: 'other', $value: '0rem' },
          x: { $type: 'other', $value: '0rem' },
          y: 'not-a-token',
        },
      },
    });
  });
});
