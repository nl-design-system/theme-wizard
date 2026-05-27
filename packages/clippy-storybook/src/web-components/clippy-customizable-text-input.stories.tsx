import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-customizable-text-input';
import React from 'react';
import '@utrecht/component-library-css/dist/index.css';

const meta = {
  id: 'clippy-customizable-text-input',
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          'Biedt de mogelijkheid om een input field & combobox uit te breiden met elementen als iconen, buttons & tekst aan het begin of eind van de input.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-customizable-text-input',
      {},
      React.createElement('input', { className: 'utrecht-textbox utrecht-textbox--html', type: 'text' }),
    ),
  tags: ['autodocs'],
  title: 'Clippy/Customizable Text Input',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis customizable-text-input',
};
