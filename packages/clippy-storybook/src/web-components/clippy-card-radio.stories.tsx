import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface ClippyCardRadioStoryArgs {
  name: string;
  value: string;
}

const createDefaultTemplate = (name: string, value: string) => html`
  <clippy-card-radio-group name="${name}" value="${value}">
    <clippy-card-radio-option value="sans">Sans Serif</clippy-card-radio-option>
    <clippy-card-radio-option value="serif">Serif</clippy-card-radio-option>
    <clippy-card-radio-option value="mono">Monospace</clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createMultipleGroupsTemplate = () => html`
  <div style="align-items: flex-start; display: flex; gap: 1rem;">
    <fieldset>
      <legend>Character</legend>
      <clippy-card-radio-group name="character">
        <clippy-card-radio-option value="wallace">Wallace</clippy-card-radio-option>
        <clippy-card-radio-option value="gromit">Gromit</clippy-card-radio-option>
      </clippy-card-radio-group>
    </fieldset>
    <fieldset>
      <legend>Snack</legend>
      <clippy-card-radio-group name="snack">
        <clippy-card-radio-option value="tea">Tea</clippy-card-radio-option>
        <clippy-card-radio-option value="crackers-and-cheese">Crackers &amp; Cheese</clippy-card-radio-option>
      </clippy-card-radio-group>
    </fieldset>
  </div>
`;

const createPreselectedValueTemplate = () => html`
  <clippy-card-radio-group name="color" value="blue">
    <clippy-card-radio-option value="red">Red</clippy-card-radio-option>
    <clippy-card-radio-option value="blue">Blue</clippy-card-radio-option>
    <clippy-card-radio-option value="green">Green</clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createSlotStartTemplate = () => html`
  <clippy-card-radio-group name="shape">
    <clippy-card-radio-option value="circle"><span slot="start">⬤</span>Circle</clippy-card-radio-option>
    <clippy-card-radio-option value="square"><span slot="start">■</span>Square</clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createSlotDescriptionTemplate = () => html`
  <clippy-card-radio-group name="style">
    <clippy-card-radio-option value="minimal">
      Minimal
      <span slot="description">Clean, lots of whitespace</span>
    </clippy-card-radio-option>
    <clippy-card-radio-option value="expressive">
      Expressive
      <span slot="description">Bold colors and large type</span>
    </clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createSlotBodyTemplate = () => html`
  <clippy-card-radio-group name="typeface">
    <clippy-card-radio-option value="sans">
      Sans Serif
      <div slot="body" style="font-family: sans-serif; font-size: 2rem;">Aa</div>
    </clippy-card-radio-option>
    <clippy-card-radio-option value="serif">
      Serif
      <div slot="body" style="font-family: serif; font-size: 2rem;">Aa</div>
    </clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createSlotFooterTemplate = () => html`
  <clippy-card-radio-group name="color-pick">
    <clippy-card-radio-option value="#007BC7">
      #007BC7
      <small slot="footer">Used 34× on your site</small>
    </clippy-card-radio-option>
    <clippy-card-radio-option value="#154273">
      #154273
      <small slot="footer">Used 12× on your site</small>
    </clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const createAllSlotsTemplate = () => html`
  <clippy-card-radio-group name="full-example" value="option-a">
    <clippy-card-radio-option value="option-a">
      <span slot="start">🎨</span>
      Option A
      <span slot="description">A short description of this option</span>
      <div slot="body">Preview content goes here</div>
      <small slot="footer">Additional metadata</small>
    </clippy-card-radio-option>
    <clippy-card-radio-option value="option-b">
      <span slot="start">✏️</span>
      Option B
      <span slot="description">A different description</span>
      <div slot="body">Different preview content</div>
      <small slot="footer">Other metadata</small>
    </clippy-card-radio-option>
  </clippy-card-radio-group>
`;

const meta: Meta<ClippyCardRadioStoryArgs> = {
  id: 'clippy-card-radio-group',
  argTypes: {
    name: { control: 'text', description: 'Form field name shared across all radio options' },
    value: { control: 'text', description: 'Currently selected value' },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-card-radio-group>` is a form-associated radio group. Each `<clippy-card-radio-option>` child is a selectable card option, and is a composition of `<clippy-card>` (its card chrome and `body`/`footer` regions are inherited; its header is custom). Only one card can be selected at a time. The group reports its value to the parent `<form>` via ElementInternals.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card Radio Group',
};

export default meta;
type Story = StoryObj<ClippyCardRadioStoryArgs>;

export const Default: Story = {
  name: 'Basic group',
  args: { name: 'font', value: '' },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: ClippyCardRadioStoryArgs }) =>
          templateToHtml(createDefaultTemplate(storyContext.args.name, storyContext.args.value)),
        type: 'code',
      },
    },
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

export const MultipleGroups: Story = {
  name: 'Multiple groups',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two independent groups with the same option values. Selecting an option in one group never affects the other — each `<clippy-card-radio-option>` belongs to exactly one parent group.',
      },
      source: {
        transform: () => templateToHtml(createMultipleGroupsTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'div',
      { style: { alignItems: 'flex-start', display: 'flex', gap: '1rem' } },
      React.createElement(
        'fieldset',
        null,
        React.createElement('legend', null, 'Character'),
        React.createElement(
          'clippy-card-radio-group',
          { name: 'character' },
          React.createElement('clippy-card-radio-option', { value: 'wallace' }, 'Wallace'),
          React.createElement('clippy-card-radio-option', { value: 'gromit' }, 'Gromit'),
        ),
      ),
      React.createElement(
        'fieldset',
        null,
        React.createElement('legend', null, 'Snack'),
        React.createElement(
          'clippy-card-radio-group',
          { name: 'snack' },
          React.createElement('clippy-card-radio-option', { value: 'tea' }, 'Tea'),
          React.createElement('clippy-card-radio-option', { value: 'crackers-and-cheese' }, 'Crackers & Cheese'),
        ),
      ),
    ),
};

export const PreselectedValue: Story = {
  name: 'Pre-selected value',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: () => templateToHtml(createPreselectedValueTemplate()),
        type: 'code',
      },
    },
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
      source: {
        transform: () => templateToHtml(createSlotStartTemplate()),
        type: 'code',
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
      source: {
        transform: () => templateToHtml(createSlotDescriptionTemplate()),
        type: 'code',
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
      source: {
        transform: () => templateToHtml(createSlotBodyTemplate()),
        type: 'code',
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
      source: {
        transform: () => templateToHtml(createSlotFooterTemplate()),
        type: 'code',
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
      source: {
        transform: () => templateToHtml(createAllSlotsTemplate()),
        type: 'code',
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
