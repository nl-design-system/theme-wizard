import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-color-table';
import React from 'react';

type ColorTableStoryArgs = {
  color?: string;
};

const meta = {
  id: 'clippy-color-table',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-color-table>` is een web component om een color scale te renderen in een tabelvorm.',
      },
    },
  },
  render: ({ color }) => React.createElement('clippy-color-table', { color }),
  tags: ['autodocs'],
  title: 'Clippy/Color Table',
} satisfies Meta<ColorTableStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis color-table',
};
