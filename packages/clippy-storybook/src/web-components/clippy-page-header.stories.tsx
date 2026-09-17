import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-header/README.md?raw';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-page-header/types.js';
import React from 'react';

type StoryArgs = {
  navigationItems: NavigationItems;
};

const meta = {
  id: 'clippy-page-header',
  args: {
    navigationItems: [],
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args: StoryArgs) => React.createElement('clippy-page-header', args),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Page Header',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
