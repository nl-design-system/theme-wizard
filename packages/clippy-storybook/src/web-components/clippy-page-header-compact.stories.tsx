import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-header-compact';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-header-compact/README.md?raw';
import React from 'react';

type StoryArgs = {
  inverse: boolean;
};

const meta = {
  id: 'clippy-page-header-compact',
  args: {
    inverse: false,
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args: StoryArgs) => React.createElement('clippy-page-header-compact', args),
  tags: ['autodocs'],
  title: 'Clippy/Page Header/Compact',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Inverse: Story = {
  name: 'Inverse',
  args: {
    inverse: true,
  },
};
