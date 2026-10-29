import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-content-select';
import { ClippyContentSelect } from '@nl-design-system-community/clippy-components/clippy-content-select';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-content-select/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-content-select/README.md?raw';
import { type Options } from '@nl-design-system-community/clippy-components/src/clippy-content-select/types.js';
import { simple as navigationSimple } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/fixtures.js';
import { full as navigationFull } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import '@nl-design-system-community/clippy-components/clippy-theme-provider';
import { html } from 'lit';
import React, { useState } from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type StoryArgs = {
  options: Options;
  name: string;
  value?: string;
  label?: string;
};

const createPageHeaderTemplate = () => html`
  <clippy-page-header slot="header" variant="compact">
    <span slot="logo">🎉 Logo</span>
    <clippy-navigation-bar slot="navigation-bar" items='${JSON.stringify(navigationSimple)}'></clippy-navigation-bar>
    <clippy-side-navigation slot="navigation-drawer" items='${JSON.stringify(navigationFull)}'><clippy-side-navigation>
  </clippy-page-header>
`;

const themes = {
  'accent-1-default': {},
  'accent-1-reversed': {
    ma: { 'navigation-bar': { background: { color: { $type: 'color', $value: 'forestgreen' } } } },
  },
  'accent-2-default': {
    ma: { 'navigation-bar': { background: { color: { $type: 'color', $value: 'darkblue' } } } },
  },
  'accent-2-reversed': {
    ma: { 'navigation-bar': { background: { color: { $type: 'color', $value: 'black' } } } },
  },
} as { [key: string]: TokenGroup };

const LiveUpdateDemo = ({ args }: { args: StoryArgs }) => {
  const defaultName = args.value ?? 'accent-1-default';
  const [theme, setTheme] = useState<TokenGroup>(themes[defaultName]);
  const { label, ...restArgs } = args;

  return React.createElement(
    'clippy-content-select',
    {
      onChange: (e) => {
        const element = e.target as ClippyContentSelect;
        setTheme(themes[element.value as string]);
      },
      ...restArgs,
    },
    [
      label ? React.createElement('span', { slot: 'label' }, label) : undefined,
      React.createElement(
        'clippy-theme-provider',
        {
          theme,
        },
        React.createElement('div', { dangerouslySetInnerHTML: { __html: templateToHtml(createPageHeaderTemplate()) } }),
      ),
    ],
  );
};

const meta = {
  id: 'clippy-content-select',
  args: {
    name: 'default',
    options: simple,
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => React.createElement(LiveUpdateDemo, { args }),
  tags: ['autodocs'],
  title: 'Clippy/Content Select',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const PredefinedValue: Story = {
  name: 'Predefined Value',
  args: {
    name: 'predefined',
    options: simple,
    value: 'accent-2-default',
  },
};

export const Labeled: Story = {
  name: 'Labeled',
  args: {
    name: 'labeled',
    label: 'Label for input',
    options: simple,
  },
};
