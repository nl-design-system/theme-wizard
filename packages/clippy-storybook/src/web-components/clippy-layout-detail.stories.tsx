import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-layout-detail';
import '@nl-design-system-community/clippy-components/clippy-layout-main';
import readme from '@nl-design-system-community/clippy-components/src/clippy-layout-detail/README.md?raw';
import React from 'react';

const meta = {
  id: 'clippy-layout-detail',
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
    React.createElement('clippy-layout-detail', args, [
      React.createElement(
        'p',
        {
          slot: 'breadcrumb',
        },
        'Breadcrumbs: Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
      ),
      React.createElement('clippy-layout-main', { id: 'content' }, [
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
        React.createElement(
          'a',
          {
            href: '#content',
            slot: 'aside',
          },
          'linkje',
        ),
        [...Array(50)].map((_, index) =>
          React.createElement(
            'p',
            { key: index },
            'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
          ),
        ),
      ]),
    ]),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Detail',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
