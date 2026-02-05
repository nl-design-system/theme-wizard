import type { Meta, StoryObj } from '@storybook/react-vite';
import colorSampleMeta from '@nl-design-system-candidate/color-sample-docs/stories/color-sample.react.meta';
import * as Stories from '@nl-design-system-candidate/color-sample-docs/stories/color-sample.stories';
// import packageJSON from '../../components-react/color-sample-react/package.json';
import {
  ColorSample as ColorSampleComponent,
  type ColorSampleProps,
} from '@nl-design-system-candidate/color-sample-react';
// import { getExternalLinks } from '../src/helpers/external-links';
import tokens from '@nl-design-system-candidate/color-sample-tokens';

// const externalLinks = getExternalLinks('https://nldesignsystem.nl/color-sample', packageJSON.homepage);

const meta = {
  ...colorSampleMeta,
  id: 'color-sample',
  parameters: { tokens },
  // ...externalLinks,
  title: 'React Componenten/Color Sample',
} satisfies Meta<typeof ColorSampleComponent>;

export default meta;

type Story = StoryObj<ColorSampleProps>;

export const ColorSample: Story = Stories.ColorSample;
// export const DesignColorSampleColor = Stories.DesignColorSampleColor;
// export const DesignColorSampleBorder = Stories.DesignColorSampleBorder;
// export const DesignColorSampleSize = Stories.DesignColorSampleSize;
