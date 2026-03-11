import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import '@nl-design-system-candidate/button-css/button.css';

interface ToggletipStoryArgs {
  position: 'top' | 'right' | 'bottom' | 'left';
  text: string;
}

const meta: Meta<ToggletipStoryArgs> = {
  id: 'clippy-toggletip',
  argTypes: {
    position: {
      control: 'select',
      description: 'Popup position relative to trigger button',
      options: ['top', 'right', 'bottom', 'left'],
    },
    text: {
      control: 'text',
      description: 'Tooltip text when default slot is empty',
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Toggletip',
};

export default meta;
type Story = StoryObj<ToggletipStoryArgs>;

export const Default: Story = {
  args: {
    position: 'top',
    text: 'Copy value to clipboard',
  },
  render: (args: ToggletipStoryArgs) =>
    React.createElement(
      'clippy-toggletip',
      {
        position: args.position,
        text: args.text,
      },
      React.createElement(
        'clippy-button',
        {
          purpose: 'subtle',
        },
        'Copy value',
      ),
    ),
};

