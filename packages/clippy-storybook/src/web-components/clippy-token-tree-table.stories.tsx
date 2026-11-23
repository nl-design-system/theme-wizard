import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-token-tree-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeFixture } from '@nl-design-system-community/clippy-components/src/clippy-token-tree-table/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-tree-table/README.md?raw';
import React from 'react';

type TokenTreeTableStoryArgs = {
  path: string;
  theme: TokenGroup;
};

const meta = {
  id: 'clippy-token-tree-table',
  args: {
    path: 'basis.text.font-size',
    theme: themeFixture,
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
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenTreeTableStoryArgs) => React.createElement('clippy-token-tree-table', args),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Token Tree Table',
} satisfies Meta<TokenTreeTableStoryArgs>;

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
