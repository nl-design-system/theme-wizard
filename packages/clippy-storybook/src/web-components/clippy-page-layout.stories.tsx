import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-layout';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-layout/README.md?raw';
import React from 'react';

type TokenSampleStoryArgs = {};

const meta = {
  id: 'clippy-page-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenSampleStoryArgs) =>
    React.createElement('clippy-page-layout', args, [
      React.createElement(
        'mark',
        {
          slot: 'header',
        },
        'masthead',
      ),
      React.createElement(
        'mark',
        {
          slot: 'footer',
        },
        'footer',
      ),
      React.createElement('mark', {}, 'content'),
    ]),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Page Layout',
} satisfies Meta<TokenSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
