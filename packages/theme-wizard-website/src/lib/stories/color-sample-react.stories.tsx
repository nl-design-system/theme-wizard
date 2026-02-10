import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import colorSampleMeta from '@nl-design-system-candidate/color-sample-docs/stories/color-sample.react.meta';
import * as Stories from '@nl-design-system-candidate/color-sample-docs/stories/color-sample.stories';
import {
  ColorSample as ColorSampleComponent,
  type ColorSampleProps,
} from '@nl-design-system-candidate/color-sample-react';
import tokens from '@nl-design-system-candidate/color-sample-tokens';

const meta = {
  ...colorSampleMeta,
  id: 'color-sample',
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Color Sample',
} satisfies Meta<typeof ColorSampleComponent>;

export default meta;

type Story = StoryObj<ColorSampleProps>;

export const ColorSample: Story = Stories.ColorSample;

export const DesignColorSampleColor: Story = {
  name: 'Design: Color Sample Color',
  args: {
    value: 'deeppink',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'color-sample': {
          'background-color': {
            $value: '0',
          },
        },
      },
    },
  },
};
export const DesignColorSampleSize: Story = {
  name: 'Design: Color Sample Size',
  args: {
    value: 'deeppink',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'color-sample': {
          'block-size': {
            $value: '0',
          },
          'inline-size': {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignColorSampleBorder: Story = {
  name: 'Design: Color Sample Border',
  args: {
    value: 'deeppink',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story:
          'Gebruik een zichtbare border zodat het vakje met de Color Sample duidelijk, wanneer de kleur heel erg lijkt op de achtergrondkleur.',
      },
    },
    editableTokens: {
      nl: {
        'color-sample': {
          'border-color': {
            $value: '0',
          },
          'border-radius': {
            $value: '0',
          },
          'border-width': {
            $value: '0',
          },
        },
      },
    },
  },
  render: ({ ...props }: ColorSampleProps) => (
    <div style={{ columnGap: '1ch', display: 'flex', flexDirection: 'row' }}>
      {Array(11)
        .fill(0)
        .map((_, index) => index)
        .map((n) => (
          <ColorSampleComponent {...props} key={n} value={`hsl(0 0% ${100 - n * 10}%)`} />
        ))}
    </div>
  ),
};
