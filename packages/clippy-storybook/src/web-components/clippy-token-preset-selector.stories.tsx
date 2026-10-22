import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-preset-selector';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-token-preset-selector/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-preset-selector/README.md?raw';
import { type Options } from '@nl-design-system-community/clippy-components/src/clippy-token-preset-selector/types.js';
import React from 'react';

type StoryArgs = {
  options: Options;
};

const meta = {
  id: 'clippy-token-preset-selector',
  args: {
    options: simple,
  },
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
