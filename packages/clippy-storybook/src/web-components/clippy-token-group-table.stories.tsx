import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-token-group-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeFixture } from '@nl-design-system-community/clippy-components/src/clippy-token-group-table/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-group-table/README.md?raw';
import React from 'react';

type TokenGroupTableStoryArgs = {
  path: string;
  theme: TokenGroup;
  valueDisplay?: 'as-authored' | 'common' | 'brand' | 'resolved';
};

const meta = {
  id: 'clippy-token-group-table',
  args: {
    path: 'basis.text.font-size',
    theme: themeFixture,
    valueDisplay: 'as-authored',
  },
  argTypes: {
    path: {
      control: 'text',
      description: 'Dot-separated path to the token group to render',
    },
    theme: {
      control: false,
      description: 'The full token tree',
    },
    valueDisplay: {
      control: 'select',
      description: 'Which value to show for tokens that reference other tokens',
      options: ['as-authored', 'common', 'brand', 'resolved'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        // Omit the theme object from the code snippet, it's too large to be readable
        transform: (_code: string, storyContext: { args: TokenGroupTableStoryArgs }) => {
          const { path, valueDisplay } = storyContext.args;
          return `<clippy-token-group-table path="${path}" value-display="${valueDisplay}"></clippy-token-group-table>`;
        },
        type: 'code',
      },
    },
  },
  render: (args: TokenGroupTableStoryArgs) => React.createElement('clippy-token-group-table', args),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Token Group Table',
} satisfies Meta<TokenGroupTableStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DirectChildren: Story = {
  name: 'Group with only direct children',
  args: {
    path: 'basis.text.font-size',
  },
};

export const NestedGroups: Story = {
  name: 'Group with nested groups',
  args: {
    path: 'basis.space',
  },
};

export const HardValues: Story = {
  name: 'Hard values',
  args: {
    path: 'brand.color',
  },
};

export const RefValues: Story = {
  name: 'Ref values',
  args: {
    path: 'basis.color.accent-1',
  },
};

export const ValueDisplayAsAuthored: Story = {
  name: 'Value display: as authored',
  args: {
    path: 'nl.button',
    valueDisplay: 'as-authored',
  },
};

export const ValueDisplayCommon: Story = {
  name: 'Value display: common',
  args: {
    path: 'nl.button',
    valueDisplay: 'common',
  },
};

export const ValueDisplayBrand: Story = {
  name: 'Value display: brand',
  args: {
    path: 'nl.button',
    valueDisplay: 'brand',
  },
};

export const ValueDisplayResolved: Story = {
  name: 'Value display: resolved',
  args: {
    path: 'nl.button',
    valueDisplay: 'resolved',
  },
};
