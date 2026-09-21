import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { CircleCheckIcon, circleCheckSvg } from '../utils/cardIcons';
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

const linkStyleCss =
  'align-items: center; color: var(--basis-color-action-1-color-default); display: inline-flex; gap: 0.25rem; text-decoration: underline;';

const linkStyle: React.CSSProperties = {
  alignItems: 'center',
  color: 'var(--basis-color-action-1-color-default)',
  display: 'inline-flex',
  gap: '0.25rem',
  textDecoration: 'underline',
};

/* Padding is per-slot: when the pre-header holds edge-to-edge media (an image, a status
 * banner), zero its padding via the public override instead of fighting it with margins —
 * a small eyebrow label above the heading (e.g. "Pre-heading") belongs in the header slot. */
const flushPreHeaderCss =
  '--clippy-card-pre-header-padding-block-end: var(--basis-space-none); --clippy-card-pre-header-padding-block-start: var(--basis-space-none); --clippy-card-pre-header-padding-inline-end: var(--basis-space-none); --clippy-card-pre-header-padding-inline-start: var(--basis-space-none);';

const flushPreHeader = {
  '--clippy-card-pre-header-padding-block-end': 'var(--basis-space-none)',
  '--clippy-card-pre-header-padding-block-start': 'var(--basis-space-none)',
  '--clippy-card-pre-header-padding-inline-end': 'var(--basis-space-none)',
  '--clippy-card-pre-header-padding-inline-start': 'var(--basis-space-none)',
} as React.CSSProperties & Record<string, string>;

const flushMediaStyleCss =
  'border-start-end-radius: var(--_clippy-card-border-radius); border-start-start-radius: var(--_clippy-card-border-radius); display: block; inline-size: 100%;';

const flushMediaStyle: React.CSSProperties = {
  borderStartEndRadius: 'var(--_clippy-card-border-radius)',
  borderStartStartRadius: 'var(--_clippy-card-border-radius)',
  display: 'block',
  inlineSize: '100%', // the pre-header region is a flex row — force this item onto its own full-width line
};

const definitionRow = (label: string, value: string) =>
  React.createElement(
    'div',
    {
      key: label,
      style: {
        borderBlockEnd: '1px solid var(--basis-color-default-border-subtle)',
        paddingBlockEnd: '0.5rem',
      },
    },
    React.createElement('div', { style: { fontWeight: 'bold' } }, label),
    React.createElement('div', {}, value),
  );

const definitionRowHtml = (label: string, value: string) =>
  `<div style="border-block-end: 1px solid var(--basis-color-default-border-subtle); padding-block-end: 0.5rem;"><div style="font-weight: bold;">${label}</div><div>${value}</div></div>`;

const createPlainTemplate = () => html`
  <clippy-card style="max-width: 20rem;">
    <h2 slot="header">Card title</h2>
    <p slot="body">Some body content for this card.</p>
  </clippy-card>
`;

const createSlotPreHeaderTemplate = () => html`
  <clippy-card style="max-width: 20rem;">
    <h2 slot="header">Card title</h2>
    <span slot="pre-header">Category label</span>
  </clippy-card>
`;

const createSlotBodyTemplate = () => html`
  <clippy-card style="max-width: 20rem;">
    <p slot="body">
      Only the body slot is filled — the pre-header, header and footer regions render no wrapper at all.
    </p>
  </clippy-card>
`;

const createSlotFooterTemplate = () => html`
  <clippy-card style="max-width: 20rem;">
    <h2 slot="header">Card title</h2>
    <div slot="footer">Footer actions</div>
  </clippy-card>
`;

const createAllSlotsTemplate = () => html`
  <clippy-card style="max-width: 20rem;">
    <h2 slot="header">Card title</h2>
    <span slot="pre-header">Category label</span>
    <p slot="body">Main card content.</p>
    <div slot="footer">Footer actions</div>
  </clippy-card>
`;

const createDefaultTemplate = () => html`
  <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
    <clippy-card style="${flushPreHeaderCss} max-width: 20rem;">
      <span slot="header" style="display: block; font-weight: bold; inline-size: 100%;">Pre-heading</span>
      <h2 slot="header" style="${headingStyleCss()}">Harrie Jekkers ereburger van Den Haag</h2>
      <div
        slot="pre-header"
        style="${flushMediaStyleCss} aspect-ratio: 16 / 10; background: linear-gradient(135deg, #0a0a0a, #2b2b40 60%, #0a0a0a);"
      ></div>
      <p slot="body" style="margin: 0;">
        Liedjesschrijver, muzikant en cabaretier Harrie Jekkers kreeg zondag 12 juli de Gouden Erepenning van Den Haag.
        Hij mag zich nu ereburger van de stad noemen.
      </p>
      <a href="#" slot="footer" style="${linkStyleCss}">Text</a>
    </clippy-card>
    <clippy-card style="${flushPreHeaderCss} max-width: 20rem;">
      <h2 slot="header" style="${headingStyleCss()}">Aanvraag rijbewijs</h2>
      <div
        slot="pre-header"
        style="${flushMediaStyleCss} align-items: center; background-color: var(--basis-color-positive-bg-default); color: var(--basis-color-positive-color-default); display: flex; gap: 0.5rem; padding: var(--basis-space-block-md) var(--basis-space-inline-md);"
      >
        ${circleCheckSvg('style="flex-shrink: 0;"')} Lorem ipsum dolor sit amet, consectetur ad * isicing elit, sed do
        eiusmod *
      </div>
      <div slot="body" style="display: grid; gap: 0.75rem;">
        ${definitionRowHtml('Zaak ingediend op', '22 juli 2024')} ${definitionRowHtml('Status', 'Uitgereikt')}
        ${definitionRowHtml('Zaaknummer', '1900-zaak-41')}
      </div>
      <a href="#" slot="footer" style="${linkStyleCss}">Bekijk zaak</a>
    </clippy-card>
  </div>
`;

const meta = {
  id: 'clippy-card',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card',
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Plain: Story = {
  name: 'Plain',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The bare card with just a `header` and `body` slotted in — no `pre-header`/`footer`, no custom-property overrides. Shows the default token values as-is.',
      },
      source: {
        transform: () => templateToHtml(createPlainTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card',
      { style: { maxWidth: '20rem' } },
      React.createElement('h2', { slot: 'header' }, 'Card title'),
      React.createElement('p', { slot: 'body' }, 'Some body content for this card.'),
    ),
};

export const SlotPreHeader: Story = {
  name: 'Slot: pre-header',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `pre-header` slot for content above the header, e.g. a status or category label.',
      },
      source: {
        transform: () => templateToHtml(createSlotPreHeaderTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card',
      { style: { maxWidth: '20rem' } },
      React.createElement('h2', { slot: 'header' }, 'Card title'),
      React.createElement('span', { slot: 'pre-header' }, 'Category label'),
    ),
};

export const SlotBody: Story = {
  name: 'Slot: body only',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Only the `body` slot is filled. The `pre-header`, `header` and `footer` regions each render no wrapper `<div>` at all when they have no assigned content.',
      },
      source: {
        transform: () => templateToHtml(createSlotBodyTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card',
      { style: { maxWidth: '20rem' } },
      React.createElement(
        'p',
        { slot: 'body' },
        'Only the body slot is filled — the pre-header, header and footer regions render no wrapper at all.',
      ),
    ),
};

export const SlotFooter: Story = {
  name: 'Slot: footer',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `footer` slot for actions or metadata below the body — here without a `body` at all.',
      },
      source: {
        transform: () => templateToHtml(createSlotFooterTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card',
      { style: { maxWidth: '20rem' } },
      React.createElement('h2', { slot: 'header' }, 'Card title'),
      React.createElement('div', { slot: 'footer' }, 'Footer actions'),
    ),
};

export const AllSlots: Story = {
  name: 'All slots combined',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All four slots used together: `pre-header`, `header`, `body`, `footer`.',
      },
      source: {
        transform: () => templateToHtml(createAllSlotsTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card',
      { style: { maxWidth: '20rem' } },
      React.createElement('h2', { slot: 'header' }, 'Card title'),
      React.createElement('span', { slot: 'pre-header' }, 'Category label'),
      React.createElement('p', { slot: 'body' }, 'Main card content.'),
      React.createElement('div', { slot: 'footer' }, 'Footer actions'),
    ),
};

export const Default: Story = {
  name: 'Default',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`clippy-card` has no built-in appearance variants — just the `pre-header`/`header`/`body`/`footer` regions and a shared design-token surface. These two examples show arbitrary content (an image, a status banner with a definition list) composed into those regions. For pre-styled variants like case, plan or product, see `clippy-card-as-link`, which extends this component.',
      },
      source: {
        transform: () => templateToHtml(createDefaultTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: '1rem' } },
      React.createElement(
        'clippy-card',
        { style: { ...flushPreHeader, maxWidth: '20rem' } },
        React.createElement('div', {
          slot: 'pre-header',
          style: {
            ...flushMediaStyle,
            aspectRatio: '16 / 10',
            background: 'linear-gradient(135deg, #0a0a0a, #2b2b40 60%, #0a0a0a)',
          },
        }),
        React.createElement(
          'span',
          { slot: 'header', style: { display: 'block', fontWeight: 'bold', inlineSize: '100%' } },
          'Pre-heading',
        ),
        React.createElement('h2', { slot: 'header', style: headingStyle() }, 'Harrie Jekkers ereburger van Den Haag'),
        React.createElement(
          'p',
          { slot: 'body', style: { margin: 0 } },
          'Liedjesschrijver, muzikant en cabaretier Harrie Jekkers kreeg zondag 12 juli de Gouden Erepenning van Den Haag. Hij mag zich nu ereburger van de stad noemen.',
        ),
        React.createElement('a', { href: '#', slot: 'footer', style: linkStyle }, 'Text'),
      ),
      React.createElement(
        'clippy-card',
        { style: { ...flushPreHeader, maxWidth: '20rem' } },
        React.createElement(
          'div',
          {
            slot: 'pre-header',
            style: {
              ...flushMediaStyle,
              alignItems: 'center',
              backgroundColor: 'var(--basis-color-positive-bg-default)',
              color: 'var(--basis-color-positive-color-default)',
              display: 'flex',
              gap: '0.5rem',
              padding: 'var(--basis-space-block-md) var(--basis-space-inline-md)',
            },
          },
          CircleCheckIcon({ style: { flexShrink: 0 } }),
          'Lorem ipsum dolor sit amet, consectetur ad * isicing elit, sed do eiusmod *',
        ),
        React.createElement('h2', { slot: 'header', style: headingStyle() }, 'Aanvraag rijbewijs'),
        React.createElement(
          'div',
          { slot: 'body', style: { display: 'grid', gap: '0.75rem' } },
          definitionRow('Zaak ingediend op', '22 juli 2024'),
          definitionRow('Status', 'Uitgereikt'),
          definitionRow('Zaaknummer', '1900-zaak-41'),
        ),
        React.createElement('a', { href: '#', slot: 'footer', style: linkStyle }, 'Bekijk zaak'),
      ),
    ),
};
