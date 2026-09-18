import '@nl-design-system-community/clippy-components/clippy-drawer';

import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-drawer/README.md?raw';
import React from 'react';
import modalMeta, { type ModalStoryArgs } from './clippy-modal.stories';

interface StoryArgs extends ModalStoryArgs {
  side: 'inline-start' | 'inline-end';
}

const meta: Meta<StoryArgs> = {
  id: 'clippy-drawer',
  args: {
    actions: 'none',
    'aria-describedby': 'modal-description',
    title: 'Drawer',
  },
  argTypes: {
    ...modalMeta.argTypes,
    side: {
      control: 'select',
      description: 'Control on which side the drawer is placed',
      options: ['inline-start', 'inline-end'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => {
    const modalRef = React.useRef<HTMLElement & { open: () => void }>(null);

    return React.createElement(
      'div',
      null,
      React.createElement(
        'clippy-button',
        {
          onClick: () => {
            if (modalRef.current) {
              modalRef.current.open();
            }
          },
        },
        'Open Drawer',
      ),
      React.createElement(
        'clippy-drawer',
        {
          ...args,
          ref: modalRef,
        },
        React.createElement(
          'p',
          { id: 'modal-description' },
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ),
        React.createElement('p', {}, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      ),
    );
  },
  title: 'clippy/Drawer',
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const InlineEnd: Story = {
  args: {
    side: 'inline-end',
  },
};
