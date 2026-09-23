import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-layout';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-layout/README.md?raw';
import React from 'react';

const meta = {
  id: 'clippy-page-layout',
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
    React.createElement('clippy-page-layout', args, [
      React.createElement('clippy-page-header', {
        slot: 'header',
      }),
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
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
