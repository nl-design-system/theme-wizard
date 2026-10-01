import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-layout-overview/README.md?raw';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';
import { createTemplate } from './clippy-layout-overview.template';

const meta = {
  id: 'clippy-layout-overview',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        transform: () => templateToHtml(createTemplate()),
        type: 'code',
      },
    },
    layout: 'fullscreen',
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createTemplate()) },
    }),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Overview',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
