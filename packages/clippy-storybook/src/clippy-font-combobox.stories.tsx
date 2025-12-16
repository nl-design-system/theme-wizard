/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-combobox';
import { html } from 'lit';


const meta = {
  id: 'clippy-font-combobox',
  parameters: {
    docs: {
      description: {
        component: "`<clippy-font-combobox>`",
      },
    },
  },
  render: () => html`<clippy-font-combobox></clippy-font-combobox>`,
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Font Combobox',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example combobox',
};
