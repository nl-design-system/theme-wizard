import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-as-link';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card-as-link/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const createDefaultTemplate = () => html`
  <clippy-card-as-link style="--clippy-card-max-inline-size: 20rem;">
    <h2 slot="header">Met de huisstijl van een bestaande website</h2>
    <p slot="body">Vul een URL in.</p>
    <a slot="link" href="#">Haal design tokens op van website</a>
  </clippy-card-as-link>
`;

const createListItemTemplate = () => html`
  <clippy-card-as-link variant="list-item" style="--clippy-card-max-inline-size: 20rem;">
    <span slot="pre-header">🔗</span>
    <span slot="header" style="align-items: center; display: flex; gap: 0.75rem;">
      <span>
        <h2>Met de huisstijl van een bestaande website</h2>
        <span style="color: var(--basis-color-default-color-subtle);">Vul een URL in.</span>
      </span>
    </span>
    <div slot="footer">→</div>
    <a slot="link" href="#">Haal design tokens op van website</a>
  </clippy-card-as-link>
`;

const meta = {
  id: 'clippy-card-as-link',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card As Link',
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
          'The whole card is a single link — clicking anywhere navigates. The `<a slot="link">` is a direct child carrying the accessible name; it is stretched to cover the full card while the visible heading/body live independently in the regular slots.',
      },
      source: {
        transform: () => templateToHtml(createDefaultTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createDefaultTemplate()) },
    }),
};

export const ListItem: Story = {
  name: 'Variant: list-item',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Set `variant="list-item"` for a compact, horizontal composition: `header` and `footer` sit side by side in a single row instead of stacking. Typically used for a short link row — a leading icon, a title (plus optional subtitle), and a trailing icon.',
      },
      source: {
        transform: () => templateToHtml(createListItemTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createListItemTemplate()) },
    }),
};
