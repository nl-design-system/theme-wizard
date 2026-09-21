import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import readme from '@nl-design-system-community/clippy-components/src/clippy-task-navigation/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { chevronRightSvg } from '../utils/cardIcons';
import { templateToHtml } from '../utils/templateToHtml';

/* The label nests INSIDE the anchor (not the other way around): ::slotted() only matches direct
 * children of the host, so the <a> — carrying the slot attribute — must be the direct child. */
const createDefaultTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="header" href="#">
      <span>Task description</span>
    </a>
    <div slot="footer">${chevronRightSvg}</div>
  </clippy-task-navigation>
`;

const createWithBodyDetailTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <a slot="header" href="#">
      <span>Task description</span>
    </a>
    <time
      slot="body"
      datetime="2025-01-01"
      style="color: var(--basis-color-default-color-subtle); white-space: nowrap;"
    >
      1 jan 2025
    </time>
    <div slot="footer">${chevronRightSvg}</div>
  </clippy-task-navigation>
`;

const createWithIconBeforeTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <span slot="pre-header" aria-hidden="true">📋</span>
    <a slot="header" href="#">
      <span>Task description</span>
    </a>
    <div slot="footer">${chevronRightSvg}</div>
  </clippy-task-navigation>
`;

const createWithLongContentTemplate = () => html`
  <clippy-task-navigation style="max-width: 22rem;">
    <span slot="pre-header" aria-hidden="true">📋</span>
    <a slot="header" href="#">
      <span>
        Icon before and a lot of content that should surely make this task navigation item wrap, but some more words
        appear here, just in case.
      </span>
    </a>
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
          'The whole row is a single link — clicking anywhere navigates. The `<a>` is a direct child of the `header` slot; a `::slotted(a)::after` overlay stretches its hit area to the full row, in pure CSS.',
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
