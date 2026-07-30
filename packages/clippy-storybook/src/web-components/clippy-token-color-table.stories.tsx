import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-color-table';
import { colorGroups } from '@nl-design-system-community/clippy-components/src/clippy-token-color-table/fixtures.js';
import { ColorGroup } from '@nl-design-system-community/clippy-components/src/clippy-token-color-table/types.js';
import React from 'react';

type ColorTableStoryArgs = {
  groups?: ColorGroup[];
};

const meta = {
  id: 'clippy-token-color-table',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-color-table>` is een web component om een color scale te renderen in een tabelvorm.',
      },
    },
  },
  render: () => React.createElement('clippy-token-color-table', { groups: colorGroups }),
  tags: ['autodocs'],
  title: 'Clippy/Token Color Table',
} satisfies Meta<ColorTableStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis token color table',
};
