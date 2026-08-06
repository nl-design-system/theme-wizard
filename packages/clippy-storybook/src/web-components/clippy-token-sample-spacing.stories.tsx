import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-spacing';
import {
  type Concepts,
  concepts,
} from '@nl-design-system-community/clippy-components/src/clippy-token-sample-spacing/types.js';
import React from 'react';

type TableColorStoryArgs = {
  concept?: Concepts;
  size?: string;
};

const meta = {
  id: 'clippy-token-sample-spacing',
  args: {
    concept: 'inline',
    size: '1rem',
  },
  argTypes: {
    concept: {
      control: { type: 'select' },
      options: concepts,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-token-sample-spacing>` is a component to illustrate spacing tokens and their concepts within the NL Design System.',
      },
    },
  },
  render: (args: TableColorStoryArgs) => React.createElement('clippy-token-sample-spacing', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample Spacing',
} satisfies Meta<TableColorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default inline',
};

export const Size: Story = {
  name: 'Size',
  args: {
    size: '3rem',
  },
};

export const ConceptBlock: Story = {
  name: 'Concept: block',
  args: {
    concept: 'block',
  },
};

export const ConceptText: Story = {
  name: 'Concept: text',
  args: {
    concept: 'text',
  },
};

export const ConceptColumn: Story = {
  name: 'Concept: column',
  args: {
    concept: 'column',
  },
};

export const ConceptRow: Story = {
  name: 'Concept: row',
  args: {
    concept: 'row',
  },
};

export const SlotLabel: Story = {
  name: 'Slot: `label`',
  render: (args: TableColorStoryArgs) =>
    React.createElement('clippy-token-sample-spacing', args, React.createElement('span', { slot: 'label' }, 'item')),
};

export const SlotLabelStart: Story = {
  name: 'Slot: `label-start`',
  args: {
    concept: 'row',
  },
  parameters: {
    docs: {
      description: {
        story: 'Slot for a second label placed at the start, only available to `row`, `column` and `text` concepts.',
      },
    },
  },
  render: (args: TableColorStoryArgs) =>
    React.createElement(
      'clippy-token-sample-spacing',
      args,
      React.createElement('span', { slot: 'label-start' }, 'item'),
    ),
};
