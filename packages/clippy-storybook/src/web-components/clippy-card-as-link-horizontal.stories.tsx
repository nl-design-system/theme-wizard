import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-as-link-horizontal';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card-as-link-horizontal/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { ChevronRightIcon, LinkIcon, chevronRightSvg, linkSvg } from '../utils/cardIcons';
import { templateToHtml } from '../utils/templateToHtml';

/* The `link` slot's <a> is a direct child of the host, separate from the visible heading in
 * `header` — its text is the link's accessible name, visually hidden and stretched to cover the
 * whole row. Row layout, alignment and the footer's zeroed start-padding are all baked into the
 * component — no overrides needed here. */
const createDefaultTemplate = () => html`
  <clippy-card-as-link-horizontal style="max-width: 22rem;">
    <a slot="link" href="#">Met de huisstijl van een bestaande website</a>
    <span slot="header" style="align-items: center; display: flex; gap: 0.75rem;">
      ${linkSvg('style="color: var(--basis-color-action-1-color-default); flex-shrink: 0;"')}
      <span>
        <h2 style="font-size: inherit; margin: 0;">Met de huisstijl van een bestaande website</h2>
        <span style="color: var(--basis-color-default-color-subtle);">Vul een URL in.</span>
      </span>
    </span>
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
          'The whole row is a single link — clicking anywhere navigates. The `<a slot="link">` is a direct child carrying the accessible name; it is stretched to cover the full row while the visible heading lives independently in the `header` slot.',
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
      React.createElement('a', { href: '#', slot: 'link' }, 'Met de huisstijl van een bestaande website'),
      React.createElement(
        'span',
        { slot: 'header', style: { alignItems: 'center', display: 'flex', gap: '0.75rem' } },
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
