import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type HTMLImageStoryArgs = Record<string, never>;

const createTemplate = () =>
  html`<clippy-html-image>
    <span slot="label">Voorbeeld titelgroottes</span>
    <h1 style="font-size: 24px">24px: Example text</h1>
    <h1 style="font-size: 32px">32px: Example text</h1>
    <h1 style="font-size: 48px">48px: Example text</h1>
  </clippy-html-image>`;

const createTemplateWithHidden = () =>
  html`<clippy-html-image hidden>
    <span slot="label">System architecture diagram</span>
    <h1>clippy-html-image with label</h1>
  </clippy-html-image>`;

const meta = {
  id: 'clippy-html-image',
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-html-image>` is een web component om voorbeeld-HTML te renderen als image. Het support een optionele `slot="label"` om de afbeelding een toegankelijk label te geven.',
      },
    },
  },
  render: () => React.createElement('clippy-html-image', null),
  tags: ['autodocs'],
  title: 'Clippy/HTML Image',
} satisfies Meta<HTMLImageStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis HTML image',
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
  render: () =>
    React.createElement(
      'clippy-html-image',
      null,
      React.createElement('span', { slot: 'label' }, 'Voorbeeld titelgroottes'),
      React.createElement('h1', { style: { fontSize: '24px' } }, '24px: Example text'),
      React.createElement('h1', { style: { fontSize: '32px' } }, '32px: Example text'),
      React.createElement('h1', { style: { fontSize: '48px' } }, '48px: Example text'),
    ),
};

export const WithHidden: Story = {
  name: 'HTML image met `hidden` attribuut',
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createTemplateWithHidden();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-html-image',
      { hidden: true },
      React.createElement('span', { slot: 'label' }, 'System architecture diagram'),
      React.createElement('h1', null, 'clippy-html-image with label'),
    ),
};
