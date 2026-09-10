import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-graph-paper';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

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

const createTemplate = () =>
  html`<clippy-graph-paper style="display: block; padding-block: 2lh; padding-inline: 3ch;"
    >Example content</clippy-graph-paper
  >`;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      source: {
        transform: () => templateToHtml(createTemplate()),
        type: 'code',
      },
    },
  },
  render: () => React.createElement('div', { dangerouslySetInnerHTML: { __html: templateToHtml(createTemplate()) } }),
};

const createoldSchoolMathTemplate = () => html`
  <clippy-graph-paper
    style="
      --clippy-graph-paper-cell-size: .5lh;
      --clippy-graph-paper-major-line-interval: 4;
      --clippy-graph-paper-line-color: rgb(0 0 0/ 6%);
      --clippy-graph-paper-major-line-color: oklch(from deepskyblue l calc(c * .5) h / 25%);

      display: block;
      padding-block: 2.5lh;
      padding-inline: 6ch;
    "
    >1 + 1 = 2</clippy-graph-paper
  >
`;

export const OldSchoolMathPaper: Story = {
  name: 'Old-school Math Paper',
  parameters: {
    docs: {
      source: {
        transform: () => templateToHtml(createoldSchoolMathTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', { dangerouslySetInnerHTML: { __html: templateToHtml(createoldSchoolMathTemplate()) } }),
};

// Example SVG taken from https://nldesignsystem.nl/componenten/ with the SVG's background graph paper removed.
const createNlDesignSystemComponentCardTemplate = () => html`
  <div style="container-type: inline-size; max-inline-size: 500px;">
    <clippy-graph-paper
      style="
        --clippy-graph-paper-cell-size: calc((100 / 12 * 1cqi) + 1px);
        --clippy-graph-paper-major-line-interval: calc(infinity);

        display: block;
        padding-block: 2lh;
        padding-inline: 3ch;
      "
    >
      <svg
        style="width: 100%; height: auto;"
        width="960"
        height="540"
        viewBox="0 0 960 540"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <g>
          <rect
            x="127"
            y="229"
            width="330"
            height="84"
            rx="16"
            fill="var(--ma-component-illustration-color, #666)"
          ></rect>
          <rect
            x="172"
            y="263"
            width="240"
            height="16"
            rx="8"
            fill="var(--ma-component-illustration-background-color, white)"
          ></rect>
          <rect
            x="505"
            y="230"
            width="326"
            height="80"
            rx="14"
            fill="var(--ma-component-illustration-background-color, white)"
            stroke="var(--ma-component-illustration-color, #666)"
            stroke-width="4"
          ></rect>
        </g>
      </svg>
    </clippy-graph-paper>
  </div>
`;

export const NlDesignSystemComponentCard: Story = {
  name: 'NL Design System Component Card',
  parameters: {
    docs: {
      source: {
        transform: () => templateToHtml(createNlDesignSystemComponentCardTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createNlDesignSystemComponentCardTemplate()) },
    }),
};
