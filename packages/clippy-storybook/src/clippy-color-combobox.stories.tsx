/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-color-combobox';
import { html } from 'lit';

const OPTIONS = [
  {
    label: '#ff6600',
    value: '#ff6600',
  },
  {
    label: '#00ff66',
    value: '#00ff66',
  },
  {
    label: '#6600ff',
    value: '#6600ff',
  },
  {
    label: '#ff0066',
    value: '#ff0066',
  },
  {
    label: '#66ff00',
    value: '#66ff00',
  },
  {
    label: '#0066ff',
    value: '#0066ff',
  },
  {
    label: '#00ff66',
    value: '#00ff66',
  },
];

const meta = {
  id: 'clippy-color-combobox',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-color-combobox>`',
      },
    },
  },
  render: () => html`<clippy-color-combobox options=${JSON.stringify(OPTIONS, null, 2)}></clippy-color-combobox>`,
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Color Combobox',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example code',
};
