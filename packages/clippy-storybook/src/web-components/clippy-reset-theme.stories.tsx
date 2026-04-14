import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type ResetThemeStoryArgs = Record<string, never>;

const createTemplate = () =>
  html`<clippy-reset-theme>
    <p>Paragraph inside reset theme</p>
  </clippy-reset-theme>`;

const createThemeLeakTemplate = () =>
  html`<div>
    <clippy-heading level="1">Heading met thema tokens</clippy-heading>
    <clippy-reset-theme>
      <clippy-heading level="1">Heading zonder thema tokens</clippy-heading>
    </clippy-reset-theme>
  </div>`;

const meta = {
  id: 'clippy-reset-theme',
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-reset-theme>` is een web component dat een reset-thema toepast op de slotted content. Het stelt alle design tokens terug naar hun standaardwaarden binnen de shadow DOM waardoor de tokens van een omliggend thema niet kunnen doordringen naar deze component.',
      },
    },
  },
  render: () => React.createElement('clippy-reset-theme', null),
  tags: ['autodocs'],
  title: 'Clippy/Reset Theme',
} satisfies Meta<ResetThemeStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis reset theme',
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
    React.createElement('clippy-reset-theme', null, React.createElement('p', null, 'Paragraph inside reset theme')),
};

export const NoThemeLeakage: Story = {
  name: 'Isolation from parent theme',
  parameters: {
    docs: {
      description: {
        story:
          'De bovenste heading erft de `ma-theme` design tokens van deze pagina. De onderste heading zit in `<clippy-reset-theme>` en heeft die tokens gereset naar `initial` — de browser-standaard.',
      },
      source: {
        transform: () => {
          const template = createThemeLeakTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'div',
      null,
      React.createElement('clippy-heading', { level: 1 }, 'Heading met thema tokens'),
      React.createElement(
        'clippy-reset-theme',
        null,
        React.createElement('clippy-heading', { level: 1 }, 'Heading zonder thema tokens'),
      ),
    ),
};
