import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import React from 'react';

interface CardAsFormFieldStoryArgs {
  name: string;
  value: string;
}

const meta: Meta<CardAsFormFieldStoryArgs> = {
  id: 'clippy-card-radio-group',
  argTypes: {
    name: {
      control: 'text',
      description: 'Form field name shared across all radio options',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-card-radio-group>` is a form-associated radio group. Each `<clippy-card-radio-option-option>` child is a selectable card option. Only one card can be selected at a time. The group reports its value to the parent `<form>` via ElementInternals.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card Radio Group',
};

export default meta;
type Story = StoryObj<CardAsFormFieldStoryArgs>;

export const Default: Story = {
  name: 'Basic group',
  args: {
    name: 'font',
    value: '',
  },
  render: ({ name, value }) =>
    React.createElement(
      'clippy-card-radio-group',
      { name, value },
      React.createElement('clippy-card-radio-option', { value: 'sans' }, 'Sans Serif'),
      React.createElement('clippy-card-radio-option', { value: 'serif' }, 'Serif'),
      React.createElement('clippy-card-radio-option', { value: 'mono' }, 'Monospace'),
    ),
};

export const PreselectedValue: Story = {
  name: 'Pre-selected value',
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'color', value: 'blue' },
      React.createElement('clippy-card-radio-option', { value: 'red' }, 'Red'),
      React.createElement('clippy-card-radio-option', { value: 'blue' }, 'Blue'),
      React.createElement('clippy-card-radio-option', { value: 'green' }, 'Green'),
    ),
};

export const SlotStart: Story = {
  name: 'Slot: start',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `start` slot for a leading icon, thumbnail, or color swatch.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'shape' },
      React.createElement(
        'clippy-card-radio-option',
        { value: 'circle' },
        React.createElement('span', { slot: 'start' }, '⬤'),
        'Circle',
      ),
      React.createElement(
        'clippy-card-radio-option',
        { value: 'square' },
        React.createElement('span', { slot: 'start' }, '■'),
        'Square',
      ),
    ),
};

export const SlotDescription: Story = {
  name: 'Slot: description',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `description` slot for a short explanatory text below the label.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'style' },
      React.createElement(
        'clippy-card-radio-option',
        { value: 'minimal' },
        'Minimal',
        React.createElement('span', { slot: 'description' }, 'Clean, lots of whitespace'),
      ),
      React.createElement(
        'clippy-card-radio-option',
        { value: 'expressive' },
        'Expressive',
        React.createElement('span', { slot: 'description' }, 'Bold colors and large type'),
      ),
    ),
};

export const SlotBody: Story = {
  name: 'Slot: body',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `body` slot for richer preview content such as a type specimen or color swatch.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'typeface' },
      React.createElement(
        'clippy-card-radio-option',
        { value: 'sans' },
        'Sans Serif',
        React.createElement('div', { slot: 'body', style: { fontFamily: 'sans-serif', fontSize: '2rem' } }, 'Aa'),
      ),
      React.createElement(
        'clippy-card-radio-option',
        { value: 'serif' },
        'Serif',
        React.createElement('div', { slot: 'body', style: { fontFamily: 'serif', fontSize: '2rem' } }, 'Aa'),
      ),
    ),
};

export const SlotFooter: Story = {
  name: 'Slot: footer',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the `footer` slot for metadata such as usage counts or secondary actions.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'color-pick' },
      React.createElement(
        'clippy-card-radio-option',
        { value: '#007BC7' },
        '#007BC7',
        React.createElement('small', { slot: 'footer' }, 'Used 34× on your site'),
      ),
      React.createElement(
        'clippy-card-radio-option',
        { value: '#154273' },
        '#154273',
        React.createElement('small', { slot: 'footer' }, 'Used 12× on your site'),
      ),
    ),
};

export const AllSlots: Story = {
  name: 'All slots combined',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All four optional slots used together: `start`, default label, `description`, `body`, `footer`.',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-radio-group',
      { name: 'full-example', value: 'option-a' },
      React.createElement(
        'clippy-card-radio-option',
        { value: 'option-a' },
        React.createElement('span', { slot: 'start' }, '🎨'),
        'Option A',
        React.createElement('span', { slot: 'description' }, 'A short description of this option'),
        React.createElement('div', { slot: 'body' }, 'Preview content goes here'),
        React.createElement('small', { slot: 'footer' }, 'Additional metadata'),
      ),
      React.createElement(
        'clippy-card-radio-option',
        { value: 'option-b' },
        React.createElement('span', { slot: 'start' }, '✏️'),
        'Option B',
        React.createElement('span', { slot: 'description' }, 'A different description'),
        React.createElement('div', { slot: 'body' }, 'Different preview content'),
        React.createElement('small', { slot: 'footer' }, 'Other metadata'),
      ),
    ),
};
