import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-as-link-horizontal';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card-as-link-horizontal/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { ChevronRightIcon, LinkIcon, chevronRightSvg, linkSvg } from '../utils/cardIcons';
import { templateToHtml } from '../utils/templateToHtml';

/* The heading nests INSIDE the anchor (not the other way around): ::slotted() only matches
 * direct children of the host, so the <a> — carrying the slot attribute — must be the direct
 * child, with the <h2> (and anything else) nested inside it. Row layout, alignment and the
 * footer's zeroed start-padding are all baked into the component — no overrides needed here. */
const createDefaultTemplate = () => html`
  <clippy-card-as-link-horizontal style="max-width: 22rem;">
    <a slot="header" href="#" style="align-items: center; display: flex; gap: 0.75rem;">
      ${linkSvg('style="color: var(--basis-color-action-1-color-default); flex-shrink: 0;"')}
      <span>
        <h2 style="font-size: inherit; margin: 0;">Met de huisstijl van een bestaande website</h2>
        <span style="color: var(--basis-color-default-color-subtle);">Vul een URL in.</span>
      </span>
    </a>
    <div slot="footer">${chevronRightSvg}</div>
  </clippy-card-as-link-horizontal>
`;

const meta = {
  id: 'clippy-card-as-link-horizontal',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card As Link Horizontal',
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
          'The whole row is a single link — clicking anywhere navigates. The `<a>` is a direct child of the `header` slot (heading nested inside it); a `::slotted(a)::after` overlay stretches its hit area to the full row, in pure CSS.',
      },
      source: {
        transform: () => templateToHtml(createDefaultTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link-horizontal',
      { style: { maxWidth: '22rem' } },
      React.createElement(
        'a',
        { href: '#', slot: 'header', style: { alignItems: 'center', display: 'flex', gap: '0.75rem' } },
        LinkIcon({ style: { color: 'var(--basis-color-action-1-color-default)', flexShrink: 0 } }),
        React.createElement(
          'span',
          {},
          React.createElement(
            'h2',
            { style: { fontSize: 'inherit', margin: 0 } },
            'Met de huisstijl van een bestaande website',
          ),
          React.createElement(
            'span',
            { style: { color: 'var(--basis-color-default-color-subtle)' } },
            'Vul een URL in.',
          ),
        ),
      ),
      React.createElement('div', { slot: 'footer' }, ChevronRightIcon()),
    ),
};
