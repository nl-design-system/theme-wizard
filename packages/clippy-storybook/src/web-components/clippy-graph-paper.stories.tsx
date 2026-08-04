import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-graph-paper';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const createTemplate = () => html`<clippy-graph-paper>Example content</clippy-graph-paper>`;

const meta = {
  id: 'clippy-graph-paper',
  argTypes: {
    '--clippy-graph-paper-cell-size': {
      control: false,
      description: 'Size of one grid cell',
      table: {
        category: 'CSS Custom Properties',
        type: { summary: '<length>' },
      },
    },
    '--clippy-graph-paper-line-size': {
      control: false,
      description: 'Thickness of the grid lines',
      table: {
        category: 'CSS Custom Properties',
        type: { summary: '<length>' },
      },
    },
    '--clippy-graph-paper-major-line-color': {
      control: false,
      description: 'Color of the major grid lines',
      table: {
        category: 'CSS Custom Properties',
        type: { summary: '<color>' },
      },
    },
    '--clippy-graph-paper-major-line-interval': {
      control: false,
      description: 'Number of cells between major grid lines',
      table: {
        category: 'CSS Custom Properties',
        type: { summary: '<number>' },
      },
    },
    '--clippy-graph-paper-minor-line-color': {
      control: false,
      description: 'Color of the minor (per-cell) grid lines',
      table: {
        category: 'CSS Custom Properties',
        type: { summary: '<color>' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-graph-paper>` renders content on top of a graph paper style background grid.',
      },
    },
  },
  render: () => React.createElement('clippy-graph-paper', {}, 'Example content'),
  tags: ['autodocs'],
  title: 'Clippy/Graph Paper',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
