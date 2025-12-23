import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { html } from 'lit';

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
  render: () => html`<clippy-html-image></clippy-html-image>`,
  tags: ['autodocs'],
  title: 'Clippy/HTML Image',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis HTML image',
  render: () =>
    html`<clippy-html-image>
      <span slot="label">Voorbeeld titelgroottes</span>
      <h1 style="font-size: 24px">24px: Example text</h1>
      <h1 style="font-size: 32px">32px: Example text</h1>
      <h1 style="font-size: 48px">48px: Example text</h1>
    </clippy-html-image>`,
};

export const WithHidden: Story = {
  name: 'HTML image met `hidden` attribuut',
  render: () =>
    html`<clippy-html-image hidden>
      <span slot="label">System architecture diagram</span>
      <h1>clippy-html-image with label</h1>
    </clippy-html-image>`,
};
