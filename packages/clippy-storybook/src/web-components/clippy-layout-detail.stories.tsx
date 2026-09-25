import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-layout-detail';
import readme from '@nl-design-system-community/clippy-components/src/clippy-layout-detail/README.md?raw';
import React from 'react';

const meta = {
  id: 'clippy-layout-detail',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args) => React.createElement('clippy-layout-detail', args, []),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Detail',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
