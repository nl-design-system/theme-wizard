import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface HTMLImageStoryArgs {
  label?: string;
  hidden?: boolean;
  forcedColorAdjust?: boolean;
  'color-scheme'?: string;
}

const createDefaultTemplate = () =>
  html`<clippy-html-image label="Voorbeeld titelgroottes">
    <h1 style="font-size: 24px">24px: Example text</h1>
    <h1 style="font-size: 32px">32px: Example text</h1>
    <h1 style="font-size: 48px">48px: Example text</h1>
  </clippy-html-image>`;

const createHiddenTemplate = () =>
  html`<clippy-html-image label="System architecture diagram" hidden>
    <h1>clippy-html-image with label</h1>
  </clippy-html-image>`;

const createForcedColorAdjustTemplate = () =>
  html`<clippy-html-image label="Forced color adjust example" forced-color-adjust>
    <div style="color: canvastext; background: canvas; padding: 20px;">Content</div>
  </clippy-html-image>`;

const createDarkColorSchemeTemplate = () =>
  html`<clippy-html-image label="Dark color scheme example" color-scheme="dark">
    <div style="background: light-dark(white, black); color: light-dark(black, white); padding: 20px;">
      Dark themed content
    </div>
  </clippy-html-image>`;

const createLightColorSchemeTemplate = () =>
  html`<clippy-html-image label="Light color scheme example" color-scheme="light">
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
    forcedColorAdjust: {
      control: 'boolean',
      description: 'When true, forces color adjustment to be auto on the image body.',
    },
    hidden: {
      control: 'boolean',
      description: 'Hidden state',
    },
    label: {
      control: 'text',
      description: 'Accessible name for the image. When provided, the element gets role="img".',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-html-image>` is een web component om voorbeeld-HTML te renderen als een `figure` element. Het component ondersteunt een `label` property om de afbeelding een toegankelijk label te geven, een `forcedColorAdjust` property voor kleurenaanpassing, en een `color-scheme` property voor het instellen van het kleurenschema.',
      },
    },
  },
  render: (args) =>
    React.createElement(
      'clippy-html-image',
      {
        colorScheme: args.colorScheme,
        forcedColorAdjust: args.forcedColorAdjust,
        hidden: args.hidden,
        label: args.label,
      },
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
  args: {
    label: 'Voorbeeld titelgroottes',
  },
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
      { label: 'Voorbeeld titelgroottes' },
      React.createElement('h1', { style: { fontSize: '24px' } }, '24px: Example text'),
      React.createElement('h1', { style: { fontSize: '32px' } }, '32px: Example text'),
      React.createElement('h1', { style: { fontSize: '48px' } }, '48px: Example text'),
    ),
};

export const WithHidden: Story = {
  name: 'HTML image met `hidden` attribuut',
  args: {
    hidden: true,
    label: 'System architecture diagram',
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
      { hidden: true, label: 'System architecture diagram' },
      React.createElement('h1', null, 'clippy-html-image with label'),
    ),
};

export const WithForcedColorAdjust: Story = {
  name: 'HTML image met `forcedColorAdjust`',
  args: {
    forcedColorAdjust: true,
    label: 'Forced color adjust example',
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
      { forcedColorAdjust: true, label: 'Forced color adjust example' },
      React.createElement('div', { style: { background: 'canvas', color: 'canvastext', padding: '20px' } }, 'Content'),
    ),
};

export const WithDarkColorScheme: Story = {
  name: 'HTML image met `color-scheme="dark"`',
  args: {
    'color-scheme': 'dark',
    label: 'Dark color scheme example',
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
      { 'color-scheme': 'dark', label: 'Dark color scheme example' },
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
    label: 'Light color scheme example',
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
      { 'color-scheme': 'light', label: 'Light color scheme example' },
      React.createElement(
        'div',
        { style: { background: 'light-dark(white, black)', color: 'light-dark(black, white)', padding: '20px' } },
        'Light themed content',
      ),
    ),
};
