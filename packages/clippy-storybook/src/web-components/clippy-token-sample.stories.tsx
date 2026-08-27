import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import {
  borderRadiusFixture,
  borderWidthFixture,
  colorFixture,
  spacingFixture,
  textFontFamilyFixture,
  textFontSizeFixture,
  textFontWeightFixture,
  textLineHeightFixture,
} from '@nl-design-system-community/clippy-components/src/clippy-token-sample/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-sample/README.md?raw';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import React from 'react';

type TokenSampleStoryArgs = {
  token: BaseDesignToken;
};

const meta = {
  id: 'clippy-token-sample',
  args: {
    token: colorFixture,
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenSampleStoryArgs) => React.createElement('clippy-token-sample', args),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Token Sample',
} satisfies Meta<TokenSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Spacing: Story = {
  args: {
    token: spacingFixture,
  },
};

export const FontSize: Story = {
  args: {
    token: textFontSizeFixture,
  },
};

export const FontFamily: Story = {
  args: {
    token: textFontFamilyFixture,
  },
};

export const FontWeight: Story = {
  args: {
    token: textFontWeightFixture,
  },
};

export const LineHeight: Story = {
  args: {
    token: textLineHeightFixture,
  },
};

export const BorderWidth: Story = {
  args: {
    token: borderWidthFixture,
  },
};

export const BorderRadius: Story = {
  args: {
    token: borderRadiusFixture,
  },
};
