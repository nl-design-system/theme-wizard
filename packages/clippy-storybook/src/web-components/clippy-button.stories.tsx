import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-candidate/button-css/button.css';

interface ButtonStoryArgs {
  disabled: boolean;
  busy: boolean;
  hint?: 'positive' | 'negative';
  'icon-only': boolean;
  pressed: boolean;
  purpose: 'primary' | 'secondary' | 'subtle';
  size: 'small' | 'medium';
  toggle: boolean;
}

const meta: Meta<ButtonStoryArgs> = {
  id: 'clippy-button',
  argTypes: {
    busy: {
      control: 'boolean',
      description: 'Busy/loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    hint: {
      control: 'select',
      description: 'Visual hint for user feedback',
      options: [undefined, 'positive', 'negative'],
    },
    'icon-only': {
      control: 'boolean',
      description: 'Display only icon without label',
    },
    pressed: {
      control: 'boolean',
      description: 'Pressed state for toggle buttons',
    },
    purpose: {
      control: 'select',
      description: 'Visual purpose of the button',
      options: ['primary', 'secondary', 'subtle'],
    },
    size: {
      control: 'select',
      description: 'Button size',
      options: ['small', 'medium'],
    },
    toggle: {
      control: 'boolean',
      description: 'Enable toggle behavior',
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Button',
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
  render: (args: ButtonStoryArgs) =>
    React.createElement(
      'clippy-button',
      {
        busy: args.busy,
        disabled: args.disabled,
        hint: args.hint,
        'icon-only': args['icon-only'],
        pressed: args.pressed,
        purpose: args.purpose,
        size: args.size,
        toggle: args.toggle,
      },
      'Standard',
    ),
};

export const Purpose: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-button', { purpose: 'primary' }, 'Primary'),
      React.createElement('clippy-button', { purpose: 'secondary' }, 'Secondary'),
      React.createElement('clippy-button', { purpose: 'subtle' }, 'Subtle'),
    ),
};

export const ButtonIcons: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'clippy-button',
        null,
        React.createElement('span', { slot: 'iconStart' }, '⭐'),
        'Start icon',
      ),
      React.createElement('clippy-button', null, 'Icon end', React.createElement('span', { slot: 'iconEnd' }, '→')),
      React.createElement(
        'clippy-button',
        null,
        React.createElement('span', { slot: 'iconStart' }, '⭐'),
        'Start and end icons',
        React.createElement('span', { slot: 'iconEnd' }, '→'),
      ),
      React.createElement(
        'clippy-button',
        { 'icon-only': true },
        React.createElement('span', { slot: 'iconStart' }, '⭐'),
        'Icon only',
      ),
    ),
};

export const Toggle: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-button', { toggle: true }, 'Toggle Button'),
      React.createElement('clippy-button', { pressed: true, toggle: true }, 'Toggle Pressed'),
    ),
};

export const State: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-button', null, 'Normal'),
      ' ',
      React.createElement('clippy-button', { busy: true }, 'Busy'),
      ' ',
      React.createElement('clippy-button', { disabled: true }, 'Disabled'),
    ),
};

export const Hint: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-button', { hint: 'positive', purpose: 'primary' }, 'Positive'),
      React.createElement('clippy-button', { hint: 'positive', purpose: 'secondary' }, 'Positive'),
      React.createElement('clippy-button', { hint: 'negative', purpose: 'primary' }, 'Negative'),
      React.createElement('clippy-button', { hint: 'negative', purpose: 'secondary' }, 'Negative'),
    ),
};

export const Size: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-button', { size: 'small' }, 'Small'),
      ' ',
      React.createElement('clippy-button', { size: 'medium' }, 'Medium'),
    ),
};
