import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/README.md?raw';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import React from 'react';

type StoryArgs = {
  items: NavigationItems;
  label: string | undefined;
};

const meta = {
  id: 'clippy-navigation-bar',
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
  render: (args: StoryArgs) => React.createElement('clippy-navigation-bar', args),
  tags: ['autodocs'],
  title: 'Clippy/Navigation Bar',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Label: Story = {
  name: 'Gelabeld',
  args: {
    label: 'Named nav',
  },
};
