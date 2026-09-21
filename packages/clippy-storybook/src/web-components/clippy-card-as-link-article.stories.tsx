import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-as-link-article';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card-as-link-article/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { ChevronRightIcon, chevronRightSvg } from '../utils/cardIcons';
import { templateToHtml } from '../utils/templateToHtml';

const headingStyleCss = (colorVar = '--_clippy-card-heading-color') =>
  `color: var(${colorVar}); font-family: var(--_clippy-card-heading-font-family); font-size: var(--_clippy-card-heading-font-size); font-weight: var(--_clippy-card-heading-font-weight); line-height: var(--_clippy-card-heading-line-height); margin: 0;`;

const headingStyle = (colorVar = '--_clippy-card-heading-color'): React.CSSProperties => ({
  color: `var(${colorVar})`,
  fontFamily: 'var(--_clippy-card-heading-font-family)',
  fontSize: 'var(--_clippy-card-heading-font-size)',
  fontWeight: 'var(--_clippy-card-heading-font-weight)' as React.CSSProperties['fontWeight'],
  lineHeight: 'var(--_clippy-card-heading-line-height)',
  margin: 0,
});

/* The heading nests INSIDE the anchor (not the other way around): ::slotted() only matches
 * direct children of the host. Pre-header padding/rounding is baked into the component — only
 * the media's own visual content (aspect-ratio, background) needs authoring here. */
const createDefaultTemplate = () => html`
  <clippy-card-as-link-article style="max-width: 20rem;">
    <div
      slot="pre-header"
      style="aspect-ratio: 16 / 10; background: linear-gradient(135deg, #0a0a0a, #2b2b40 60%, #0a0a0a);"
    ></div>
    <a slot="header" href="#" style="display: block;">
      <span style="display: block; font-weight: bold;">Pre-heading</span>
      <h2 style="${headingStyleCss()}">Harrie Jekkers ereburger van Den Haag</h2>
    </a>
    <p slot="body" style="margin: 0;">
      Liedjesschrijver, muzikant en cabaretier Harrie Jekkers kreeg zondag 12 juli de Gouden Erepenning van Den Haag.
      Hij mag zich nu ereburger van de stad noemen.
    </p>
    <div slot="footer" style="display: flex; justify-content: flex-end; width: 100%;">${chevronRightSvg}</div>
  </clippy-card-as-link-article>
`;

const meta = {
  id: 'clippy-card-as-link-article',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card As Link Article',
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
          "The whole card is a single link — clicking anywhere navigates, not just the heading text. The `<a>` is a direct child of the `header` slot (heading nested inside it); a `::slotted(a)::after` overlay stretches its hit area to the full card, in pure CSS. The pre-header media's zero padding and rounded top corners come from the component itself.",
      },
      source: {
        transform: () => templateToHtml(createDefaultTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link-article',
      { style: { maxWidth: '20rem' } },
      React.createElement('div', {
        slot: 'pre-header',
        style: {
          aspectRatio: '16 / 10',
          background: 'linear-gradient(135deg, #0a0a0a, #2b2b40 60%, #0a0a0a)',
        },
      }),
      React.createElement(
        'a',
        { href: '#', slot: 'header', style: { display: 'block' } },
        React.createElement('span', { style: { display: 'block', fontWeight: 'bold' } }, 'Pre-heading'),
        React.createElement('h2', { style: headingStyle() }, 'Harrie Jekkers ereburger van Den Haag'),
      ),
      React.createElement(
        'p',
        { slot: 'body', style: { margin: 0 } },
        'Liedjesschrijver, muzikant en cabaretier Harrie Jekkers kreeg zondag 12 juli de Gouden Erepenning van Den Haag. Hij mag zich nu ereburger van de stad noemen.',
      ),
      React.createElement(
        'div',
        { slot: 'footer', style: { display: 'flex', justifyContent: 'flex-end', width: '100%' } },
        ChevronRightIcon(),
      ),
    ),
};
