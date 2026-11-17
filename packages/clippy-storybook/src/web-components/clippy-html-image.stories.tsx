import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import readme from '@nl-design-system-community/clippy-components/src/clippy-html-image/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface HTMLImageStoryArgs {
  hidden?: boolean;
  'forced-color-adjust'?: boolean;
  'color-scheme'?: string;
}

const createDefaultTemplate = () =>
  html`<clippy-html-image>
    <span slot="label">Voorbeeld titelgroottes</span>
    <h1 style="font-size: 24px">24px: Example text</h1>
    <h1 style="font-size: 32px">32px: Example text</h1>
    <h1 style="font-size: 48px">48px: Example text</h1>
  </clippy-html-image>`;

const createHiddenTemplate = () =>
  html`<clippy-html-image hidden>
    <span slot="label">System architecture diagram</span>
    <h1>clippy-html-image with label</h1>
  </clippy-html-image>`;

const createForcedColorAdjustTemplate = () =>
  html`<clippy-html-image forced-color-adjust>
    <span slot="label">Forced color adjust example</span>
    <div style="color: canvastext; background: canvas; padding: 20px;">Content</div>
  </clippy-html-image>`;

const createDarkColorSchemeTemplate = () =>
  html`<clippy-html-image color-scheme="dark">
    <span slot="label">Dark color scheme example</span>
    <div style="background: light-dark(white, black); color: light-dark(black, white); padding: 20px;">
      Dark themed content
    </div>
  </clippy-html-image>`;

const createLightColorSchemeTemplate = () =>
  html`<clippy-html-image color-scheme="light">
    <span slot="label">Light color scheme example</span>
    <div style="background: light-dark(white, black); color: light-dark(black, white); padding: 20px;">
      Light themed content
    </div>
  </clippy-html-image>`;

const meta: Meta<HTMLImageStoryArgs> = {
  id: 'clippy-html-image',
  argTypes: {
    'color-scheme': {
      control: 'select',
      description: 'Sets the color scheme for the image body. Accepts "dark" or "light".',
      options: [undefined, 'dark', 'light'],
    },
    'forced-color-adjust': {
      control: 'boolean',
      description: 'When true, forces color adjustment to be auto on the image body.',
    },
    hidden: {
      control: 'boolean',
      description: 'Hidden state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args) =>
    React.createElement(
      'clippy-html-image',
      args,
      React.createElement('span', { slot: 'label' }, 'Voorbeeld titelgroottes'),
      React.createElement('h1', { style: { fontSize: '24px' } }, '24px: Example text'),
      React.createElement('h1', { style: { fontSize: '32px' } }, '32px: Example text'),
      React.createElement('h1', { style: { fontSize: '48px' } }, '48px: Example text'),
    ),
  tags: ['autodocs'],
  title: 'Clippy/HTML Image',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis HTML image',
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createDefaultTemplate();
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
  args: {
    hidden: true,
  },
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createHiddenTemplate();
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

export const WithForcedColorAdjust: Story = {
  name: 'HTML image met `forcedColorAdjust`',
  args: {
    'forced-color-adjust': true,
  },
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createForcedColorAdjustTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-html-image',
      { 'forced-color-adjust': true },
      React.createElement('span', { slot: 'label' }, 'Forced color adjust example'),
      React.createElement('div', { style: { background: 'canvas', color: 'canvastext', padding: '20px' } }, 'Content'),
    ),
};

export const WithDarkColorScheme: Story = {
  name: 'HTML image met `color-scheme="dark"`',
  args: {
    'color-scheme': 'dark',
  },
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createDarkColorSchemeTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-html-image',
      { 'color-scheme': 'dark' },
      React.createElement('span', { slot: 'label' }, 'Dark color scheme example'),
      React.createElement(
        'div',
        { style: { background: 'light-dark(white, black)', color: 'light-dark(black, white)', padding: '20px' } },
        'Dark themed content',
      ),
    ),
};

export const WithLightColorScheme: Story = {
  name: 'HTML image met `color-scheme="light"`',
  args: {
    'color-scheme': 'light',
  },
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createLightColorSchemeTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-html-image',
      { 'color-scheme': 'light' },
      React.createElement('span', { slot: 'label' }, 'Light color scheme example'),
      React.createElement(
        'div',
        { style: { background: 'light-dark(white, black)', color: 'light-dark(black, white)', padding: '20px' } },
        'Light themed content',
      ),
    ),
};
