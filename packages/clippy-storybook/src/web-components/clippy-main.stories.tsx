import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-main';
import readme from '@nl-design-system-community/clippy-components/src/clippy-main/README.md?raw';
import React from 'react';

const meta = {
  id: 'clippy-main',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args) =>
    React.createElement('clippy-main', args, [
      React.createElement(
        'mark',
        {
          slot: 'header',
        },
        'header',
      ),
      React.createElement(
        'mark',
        {
          slot: 'aside',
        },
        'aside',
      ),
      React.createElement('mark', {}, 'content'),
    ]),
  tags: ['autodocs'],
  title: 'Clippy/Main',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
