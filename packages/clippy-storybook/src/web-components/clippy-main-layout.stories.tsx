import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-main-layout';
import readme from '@nl-design-system-community/clippy-components/src/clippy-main-layout/README.md?raw';
import React from 'react';

const meta = {
  id: 'clippy-main-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args) => React.createElement('clippy-main-layout', args, []),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Main Layout',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
