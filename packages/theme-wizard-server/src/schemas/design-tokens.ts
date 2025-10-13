import { z } from '@hono/zod-openapi';

const WallaceExtensions = z.object({
  'com.projectwallace.css-authored-as': z.string(),
  'com.projectwallace.usage-count': z.int().positive(),
});

const ColorComponent = z.union([z.number(), z.literal('none')]);

const ColorValue = z.strictObject({
  alpha: z.number().gte(0).lte(1),
  colorSpace: z.string(),
  components: z.tuple([ColorComponent, ColorComponent, ColorComponent]),
});

const Dimension = z.object({
  $extensions: WallaceExtensions,
  $type: z.literal('dimension'),
  $value: z.strictObject({
    unit: z.string(),
    value: z.number(),
  }),
});

const UnparsedToken = z.object({
  $extensions: WallaceExtensions,
  $type: z.never(),
  $value: z.string(),
});

export const DesignTokens = z
  .strictObject({
    colors: z.record(
      z.string(),
      z.strictObject({
        $extensions: WallaceExtensions.extend({
          'com.projectwallace.css-properties': z.array(z.string()),
        }),
        $type: z.literal('color'),
        $value: ColorValue,
      }),
    ),
    fontFamilies: z.record(
      z.string(),
      z.strictObject({
        $extensions: WallaceExtensions,
        $type: z.literal('fontFamily'),
        $value: z.array(z.string()),
      }),
    ),
    fontSizes: z.record(z.string(), z.union([Dimension, UnparsedToken])),
  })
  .openapi({
    example: {
      colors: {
        'black-123': {
          $extensions: {
            'com.projectwallace.css-authored-as': '#000',
            'com.projectwallace.css-properties': ['color', 'background-color'],
            'com.projectwallace.usage-count': 1,
          },
          $type: 'color',
          $value: {
            alpha: 1,
            colorSpace: 'rgba',
            components: [0, 0, 0],
          },
        },
      },
      fontFamilies: {
        'fontFamily-1': {
          $extensions: {
            'com.projectwallace.css-authored-as': 'Arial, sans-serif',
            'com.projectwallace.usage-count': 1,
          },
          $type: 'fontFamily',
          $value: ['Arial', 'sans-serif'],
        },
      },
      fontSizes: {
        'fontSize-1234': {
          $extensions: {
            'com.projectwallace.css-authored-as': '1.4rem',
            'com.projectwallace.usage-count': 1,
          },
          $type: 'dimension',
          $value: {
            unit: 'rem',
            value: 1.4,
          },
        },
        'fontSize-5678': {
          $extensions: {
            'com.projectwallace.css-authored-as': '1em',
            'com.projectwallace.usage-count': 1,
          },
          $value: '1em',
        },
      },
    },
    type: 'object',
  });
