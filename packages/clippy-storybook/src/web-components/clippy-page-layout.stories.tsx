import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-layout';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-layout/README.md?raw';
import { full } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml.js';
import {
  createOverviewTemplate as clippyOverviewTemplate,
  createSingleColumnTemplate as clippySingleColumnTemplate,
} from './clippy-layout.template.js';

// Prettier ignore to prevent double-quotes
// prettier-ignore
const createDefaultTemplate = () => html`
  <clippy-page-layout>
    <clippy-page-header slot="header" variant="default">
      <span slot="logo">🎉 Logo</span>
      <clippy-navigation-bar slot="navigation-bar" items='${JSON.stringify(simple)}'></clippy-navigation-bar>
      <clippy-side-navigation slot="navigation-drawer" items='${JSON.stringify(full)}'><clippy-side-navigation>
      <clippy-button slot="end" purpose="subtle">Nederlands</clippy-button>
    </clippy-page-header>

    ${templateToHtml(clippyOverviewTemplate())}

    <mark slot="footer">Footer</mark>
  </clippy-page-layout>
`;

// Prettier ignore to prevent double-quotes
// prettier-ignore
const createSingleColumnTemplate = () => html`
  <clippy-page-layout layout-block-alignment="center">
    <clippy-page-header slot="header" variant="default">
      <span slot="logo">🎉 Logo</span>
      <clippy-navigation-bar slot="navigation-bar" items='${JSON.stringify(simple)}'></clippy-navigation-bar>
      <clippy-side-navigation slot="navigation-drawer" items='${JSON.stringify(full)}'><clippy-side-navigation>
      <clippy-button slot="end" purpose="subtle">Nederlands</clippy-button>
    </clippy-page-header>

    ${templateToHtml(clippySingleColumnTemplate())}

    <mark slot="footer">Footer</mark>
  </clippy-page-layout>
`;

const meta = {
  id: 'clippy-page-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createDefaultTemplate()) },
    }),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Page Layout',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Center: Story = {
  name: 'layout-block-alignment: center',
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createSingleColumnTemplate()) },
    }),
};
