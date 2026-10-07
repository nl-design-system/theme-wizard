import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-layout/README.md?raw';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';
import { createOverviewTemplate, createDetailTemplate, createSingleColumnTemplate } from './clippy-layout.template';

const meta = {
  id: 'clippy-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        transform: () => templateToHtml(createOverviewTemplate()),
        type: 'code',
      },
    },
    layout: 'fullscreen',
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createOverviewTemplate()) },
    }),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Content',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Overview',
};

export const Detail: Story = {
  name: 'Detail',
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createDetailTemplate()) },
    }),
};

export const SingleColumn: Story = {
  name: 'Single column',
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createSingleColumnTemplate()) },
    }),
};
