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
import { createTemplate as clippyLayoutDetailTemplate } from './clippy-layout-detail.template.js';

// Prettier ignore to prevent double-quotes
// prettier-ignore
const createTemplate = () => html`
  <clippy-page-layout>
    <clippy-page-header slot="header" variant="default">
      <span slot="logo">🎉 Logo</span>
      <clippy-navigation-bar slot="navigation-bar" items='${JSON.stringify(simple)}'></clippy-navigation-bar>
      <clippy-side-navigation slot="navigation-drawer" items='${JSON.stringify(full)}'><clippy-side-navigation>
      <clippy-button slot="end" purpose="subtle">Nederlands</clippy-button>
    </clippy-page-header>

    ${templateToHtml(clippyLayoutDetailTemplate())}

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
  // render: (args) =>
  //   React.createElement('clippy-page-layout', args, [
  //     React.createElement(
  //       'clippy-page-header',
  //       {
  //         slot: 'header',
  //         variant: 'default',
  //       },
  //       [
  //         React.createElement('span', { slot: 'logo' }, '🎉 Logo'),
  //         React.createElement('clippy-navigation-bar', { items: simple, slot: 'navigation-bar' }),
  //         React.createElement('clippy-side-navigation', { items: full, slot: 'navigation-drawer' }),
  //         React.createElement('clippy-button', { purpose: 'subtle', slot: 'end' }, 'Nederlands'),
  //       ],
  //     ),
  //     React.createElement(
  //       'mark',
  //       {
  //         slot: 'footer',
  //       },
  //       'footer',
  //     ),
  //     React.createElement('mark', {}, 'content'),
  //   ]),
  render: () =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createTemplate()) },
    }),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Page Layout',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
