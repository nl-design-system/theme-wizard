import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-table-color';
import { tokenCollection } from '@nl-design-system-community/clippy-components/src/clippy-token-table-color/fixtures.js';
import { TokenCollection } from '@nl-design-system-community/clippy-components/src/clippy-token-table-color/types.js';
import React from 'react';

type TableColorStoryArgs = {
  collection?: TokenCollection[];
};

const meta = {
  id: 'clippy-token-table-color',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-table-color>` is een web component om een color scale te renderen in een tabelvorm.',
      },
    },
  },
  render: () => React.createElement('clippy-token-table-color', { collection: tokenCollection }),
  tags: ['autodocs'],
  title: 'Clippy/Token Table Color',
} satisfies Meta<TableColorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis token color table',
};
