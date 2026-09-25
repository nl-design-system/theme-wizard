import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import readme from '@nl-design-system-community/clippy-components/src/clippy-task-navigation/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

/* The `link` slot's <a> is a direct child of the host, separate from the visible label in
 * `header` — its text is the link's accessible name, visually hidden and stretched to cover the
 * whole row. */
const createDefaultTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="link" href="#">Task description</a>
    <span slot="header">
      <span>Task description</span>
    </span>
    <div slot="footer">→</div>
  </clippy-task-navigation>
`;

const createWithBodyDetailTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="link" href="#">Task description</a>
    <span slot="header">
      <span>Task description</span>
    </span>
    <time
      slot="body"
      datetime="2025-01-01"
      style="color: var(--basis-color-default-color-subtle); white-space: nowrap;"
    >
      1 jan 2025
    </time>
    <div slot="footer">→</div>
  </clippy-task-navigation>
`;

const createWithIconBeforeTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="link" href="#">Task description</a>
    <span slot="pre-header" aria-hidden="true">📋</span>
    <span slot="header">
      <span>Task description</span>
    </span>
    <div slot="footer">→</div>
  </clippy-task-navigation>
`;

const createWithLongContentTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="link" href="#">
      Icon before and a lot of content that should surely make this task navigation item wrap, but some more words
      appear here, just in case.
    </a>
    <span slot="pre-header" aria-hidden="true">📋</span>
    <span slot="header">
      <span>
        Icon before and a lot of content that should surely make this task navigation item wrap, but some more words
        appear here, just in case.
      </span>
    </span>
  </clippy-task-navigation>
`;

const meta = {
  id: 'clippy-task-navigation',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Task Navigation',
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: 'Default',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The whole row is a single link — clicking anywhere navigates. The `<a slot="link">` is a direct child carrying the accessible name; it is stretched to cover the full row while the visible label lives independently in the `header` slot.',
      },
      source: {
        transform: () => templateToHtml(createDefaultTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', { dangerouslySetInnerHTML: { __html: templateToHtml(createDefaultTemplate()) } }),
};

export const WithBodyDetail: Story = {
  name: 'Body slot (detail)',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: () => templateToHtml(createWithBodyDetailTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createWithBodyDetailTemplate()) },
    }),
};

export const WithIconBefore: Story = {
  name: 'Icon before',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: () => templateToHtml(createWithIconBeforeTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createWithIconBeforeTemplate()) },
    }),
};

export const WithLongContent: Story = {
  name: 'Long content',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: () => templateToHtml(createWithLongContentTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createWithLongContentTemplate()) },
    }),
};
