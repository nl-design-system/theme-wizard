import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-breadcrumb-navigation';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-breadcrumb-navigation/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-breadcrumb-navigation/README.md?raw';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import React from 'react';

type StoryArgs = {
  items: NavigationItems;
  label?: string;
};

const meta = {
  id: 'clippy-breadcrumb-navigation',
  args: {
    items: simple,
    label: undefined,
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => React.createElement('clippy-breadcrumb-navigation', args),
  tags: ['autodocs'],
  title: 'Clippy/Breadcrumb Navigation',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
