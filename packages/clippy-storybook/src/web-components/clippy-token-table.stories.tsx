import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-table';
import { tokensFixture } from '@nl-design-system-community/clippy-components/src/clippy-token-table/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-table/README.md?raw';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import React from 'react';

type TokenTableStoryArgs = {
  tokens: BaseDesignToken;
};

const meta = {
  id: 'clippy-token-table',
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: () =>
    React.createElement('clippy-token-table', {
      tokens: tokensFixture,
    }),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Token Table',
} satisfies Meta<TokenTableStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis token table',
};
