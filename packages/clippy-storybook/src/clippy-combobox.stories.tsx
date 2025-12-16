/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-combobox';
import { html } from 'lit';

const OPTIONS = [
  {
    label: 'Bert',
    value: 'bert',
  },
  {
    label: 'Ernie',
    value: 'ernie',
  },
];

const meta = {
  id: 'clippy-combobox',
  parameters: {
    docs: {
      description: {
        component: "`<clippy-combobox>`",
      },
    },
  },
  render: () => html`<clippy-combobox options=${JSON.stringify(OPTIONS, null, 2)}></clippy-combobox>`,
  tags: ['autodocs'],
  title: 'Clippy/Combobox',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example combobox',
};
