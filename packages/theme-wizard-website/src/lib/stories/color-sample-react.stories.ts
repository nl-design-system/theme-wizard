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
