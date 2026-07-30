import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import React from 'react';

type ColorSampleStoryArgs = {
  color?: string;
  label?: string;
};

const meta = {
  id: 'clippy-color-sample',
  argTypes: {
    color: {
      control: { type: 'color' },
      description: 'De kleur van de color-sample. Ondersteunt alle geldige CSS-kleurwaarden.',
    },
    label: {
      control: { type: 'text' },
      description: 'De label van de color-sample.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-color-sample>` is een web component om een color-sample te renderen als een SVG-afbeelding. Het `color`-attribuut bepaalt de weergegeven kleur en ondersteunt alle geldige CSS-kleurwaarden. Het is een web-component-implementatie van de `nl-color-sample` component.',
      },
    },
  },
  render: ({ color, label }) => React.createElement('clippy-color-sample', { color, label }),
  tags: ['autodocs'],
  title: 'Clippy/Color Sample',
} satisfies Meta<ColorSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis color-sample',
  args: {
    color: '#8a3a9f',
  },
};

export const Label: Story = {
  name: 'Label in color-sample',
  args: {
    color: '#8a3a9f',
    label: 'Label',
  },
};

export const Rectangle: Story = {
  name: 'Rechthoekige color-sample',
  args: {
    color: '#8a3a9f',
  },
  render: ({ color, label }) =>
    React.createElement('clippy-color-sample', { color, label, style: { '--nl-color-sample-inline-size': '3rem' } }),
};

export const Multiple: Story = {
  name: 'Meerdere color-samples',
  render: () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('clippy-color-sample', { color: '#007BC7' }),
      React.createElement('clippy-color-sample', { color: 'hsl(200deg 50% 20%)' }),
      React.createElement('clippy-color-sample', { color: 'rgb(from red r g b / 50%)' }),
    ),
};
