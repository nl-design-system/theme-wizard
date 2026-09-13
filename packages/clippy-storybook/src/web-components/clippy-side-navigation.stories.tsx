import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
import { full } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/README.md?raw';
import { SideNavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/types.js';
import React from 'react';

type TokenSampleStoryArgs = {
  items: SideNavigationItems;
  'eager-collapse': boolean;
};

const meta = {
  id: 'clippy-side-navigation',
  args: {
    'eager-collapse': false,
    items: full,
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenSampleStoryArgs) => React.createElement('clippy-side-navigation', args),
  tags: ['autodocs'],
  title: 'Clippy/Side Navigation',
} satisfies Meta<TokenSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const EagerCollapse: Story = {
  name: 'Sluit alle subitems',
  args: {
    'eager-collapse': true,
  },
};
