import type { Meta, StoryObj } from '@storybook/react-vite';
import { GemeenteVoorbeeldHome, type GemeenteVoorbeeldHomeProps } from '@nl-design-system-community/theme-wizard-templates/react';
import * as React from 'react';
import '@utrecht/component-library-css';
import documentation from './docs/Home.md?raw';

const Home = GemeenteVoorbeeldHome as React.ComponentType<GemeenteVoorbeeldHomeProps>;

const meta = {
  component: Home,
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Templates/Gemeente Voorbeeld/Home',
} satisfies Meta<GemeenteVoorbeeldHomeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Home',
};
