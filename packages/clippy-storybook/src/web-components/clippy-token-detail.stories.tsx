import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  // borderRadiusFixture,
  // borderWidthFixture,
  colorFixture,
  spacingFixture,
  textFontFamilyFixture,
  textFontSizeFixture,
  textFontWeightFixture,
  textLineHeightFixture,
} from '@nl-design-system-community/clippy-components/src/clippy-token-detail/fixtures.js';
import '@nl-design-system-community/clippy-components/clippy-token-detail';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-detail/README.md?raw';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import React from 'react';

interface TokenDetailStoryArgs {
  token: BaseDesignToken;
}

const meta = {
  id: 'clippy-token-detail',
  args: {
    token: colorFixture,
  },
  // argTypes: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenDetailStoryArgs) => React.createElement('clippy-token-detail', args),
  tags: ['autodocs'],
  title: 'clippy/Token Detail',
} satisfies Meta<TokenDetailStoryArgs>;

export default meta;
type Story = StoryObj<TokenDetailStoryArgs>;

export const Default: Story = {
  name: 'Color',
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

// export const BorderWidth: Story = {
//   args: {
//     token: borderWidthFixture,
//   },
// };

// export const BorderRadius: Story = {
//   args: {
//     token: borderRadiusFixture,
//   },
// };
