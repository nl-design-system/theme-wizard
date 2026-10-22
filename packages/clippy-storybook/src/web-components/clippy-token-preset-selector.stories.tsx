import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-preset-selector';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-preset-selector/README.md?raw';
import React from 'react';

type StoryArgs = {};

const meta = {
  id: 'clippy-token-preset-selector',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => React.createElement('clippy-token-preset-selector', args),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Preset Selector ',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
