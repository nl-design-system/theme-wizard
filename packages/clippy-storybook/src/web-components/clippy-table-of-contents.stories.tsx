import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-table-of-contents';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-table-of-contents/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-table-of-contents/README.md?raw';
import React from 'react';

type StoryArgs = {
  items: NavigationItems;
  label?: string;
  style?: React.CSSProperties;
};

const defaultArgs = {
  items: simple,
  label: undefined,
};

const meta = {
  id: 'clippy-table-of-contents',
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => React.createElement('clippy-table-of-contents', args),
  tags: ['autodocs'],
  title: 'Clippy/Table Of Contents',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
