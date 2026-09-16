import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-layout';
import readme from '@nl-design-system-community/clippy-components/src/clippy-layout/README.md?raw';
import React from 'react';

type TokenSampleStoryArgs = {};

const meta = {
  id: 'clippy-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenSampleStoryArgs) => React.createElement('clippy-layout', args),
  tags: ['autodocs'],
  title: 'Clippy/Layout',
} satisfies Meta<TokenSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
