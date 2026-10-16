import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-table-of-content';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-table-of-content/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-table-of-content/README.md?raw';
import React from 'react';

type StoryArgs = {
  items: NavigationItems;
  label: string | undefined;
};

const meta = {
  id: 'clippy-table-of-content',
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
  render: (args: StoryArgs) => React.createElement('clippy-table-of-content', args),
  tags: ['autodocs'],
  title: 'Clippy/Table Of Content',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
