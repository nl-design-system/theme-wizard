import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import React from 'react';

interface TaskNavigationStoryArgs {
  content: string;
  href: string;
}

const meta = {
  id: 'clippy-task-navigation',
  args: {
    content: 'Task description',
    href: '#',
  },
  argTypes: {
    content: {
      name: 'Content',
      description: 'Label text (default slot)',
      type: { name: 'string', required: true },
    },
    href: {
      name: 'href',
      description: 'Link destination',
      type: { name: 'string', required: true },
    },
  },
  render: ({ content, href }: TaskNavigationStoryArgs) =>
    React.createElement('clippy-task-navigation', { href }, content),
  tags: ['autodocs'],
  title: 'Clippy/Task Navigation',
} satisfies Meta<TaskNavigationStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Task Navigation',
};

export const WithDetails: Story = {
  name: 'Details slot',
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      'clippy-task-navigation',
      { href: '#' },
      'Task description',
      React.createElement('time', { dateTime: '2025-01-01', slot: 'details' }, '1 jan 2025'),
    ),
};

export const WithActions: Story = {
  name: 'Actions slot',
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      'clippy-task-navigation',
      { href: '#' },
      'Task description',
      React.createElement('span', { slot: 'actions' }, '→'),
    ),
};

export const WithDetailsAndActions: Story = {
  name: 'Details and actions',
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      'clippy-task-navigation',
      { href: '#' },
      'Task description',
      React.createElement('time', { dateTime: '2025-01-01', slot: 'details' }, '1 jan 2025'),
      React.createElement('span', { slot: 'actions' }, '→'),
    ),
};

export const WithIconBefore: Story = {
  name: 'Icon before',
  parameters: {
    controls: { disable: true },
  },
  render: () =>
    React.createElement(
      'clippy-task-navigation',
      { href: '#' },
      React.createElement('span', { slot: 'iconStart' }, '📋'),
      'Task description',
      React.createElement('span', { slot: 'actions' }, '→'),
    ),
};
