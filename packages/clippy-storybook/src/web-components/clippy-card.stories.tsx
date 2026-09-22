import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

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
