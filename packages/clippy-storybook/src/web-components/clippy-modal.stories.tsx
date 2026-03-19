import '@nl-design-system-community/clippy-components/clippy-modal';

import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-modal/README.md?raw';
import React from 'react';

interface ModalStoryArgs {
  'aria-describedby'?: string;
  actions: 'none' | 'cancel' | 'confirm' | 'both';
  cancelLabel: string;
  closedBy: string;
  confirmLabel: string;
  standardOpen: boolean;
  title: string;
}

const meta: Meta<ModalStoryArgs> = {
  id: 'clippy-modal',
  argTypes: {
    actions: {
      control: 'select',
      description: 'Control which footer actions are rendered',
      options: ['none', 'cancel', 'confirm', 'both'],
    },
    'aria-describedby': {
      control: 'text',
      description: 'Id of an element that describes the dialog, used for aria-describedby',
    },
    cancelLabel: {
      control: 'text',
      description: 'Label for the cancel button',
    },
    closedBy: {
      control: 'text',
      description: 'How the dialog can be closed (e.g., "any", "closerequest")',
    },
    confirmLabel: {
      control: 'text',
      description: 'Label for the confirm button',
    },
    standardOpen: {
      control: 'boolean',
      description: 'When true, the dialog is open when the page loads',
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Modal',
};

export default meta;
type Story = StoryObj<ModalStoryArgs>;

export const Default: Story = {
  args: {
    actions: 'both',
    closedBy: 'any',
    standardOpen: false,
    title: 'Dialog Title',
  },
  render: (args: ModalStoryArgs) => {
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
        'Open Modal',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: args.actions,
          'aria-describedby': args['aria-describedby'],
          'cancel-label': args.cancelLabel,
          'closed-by': args.closedBy,
          'confirm-label': args.confirmLabel,
          ref: modalRef,
          title: args.title,
        },
        React.createElement('p', null, 'This is the modal content. You can place any content here.'),
      ),
    );
  },
};

export const ActionsNone: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (No Actions)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'none',
          ref: modalRef,
          title: 'Modal without footer actions',
        },
        React.createElement('p', null, 'This modal has no footer buttons. You can only close it using the X button.'),
      ),
    );
  },
};

export const ActionsCancel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Cancel Only)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'cancel',
          ref: modalRef,
          title: 'Modal with cancel button',
        },
        React.createElement('p', null, 'This modal has only a cancel button in the footer.'),
      ),
    );
  },
};

export const ActionsConfirm: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Confirm Only)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'confirm',
          ref: modalRef,
          title: 'Modal with confirm button',
        },
        React.createElement('p', null, 'This modal has only a confirm button in the footer.'),
      ),
    );
  },
};

export const ActionsBoth: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Both Actions)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'both',
          ref: modalRef,
          title: 'Modal with both buttons',
        },
        React.createElement('p', null, 'This modal has both confirm and cancel buttons in the footer.'),
      ),
    );
  },
};

export const CustomLabels: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Custom Labels)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'both',
          'cancel-label': "I'd rather not",
          'confirm-label': 'Most definitely',
          ref: modalRef,
          title: 'Modal met aangepaste labels',
        },
        React.createElement('p', null, 'Deze modal heeft aangepaste knoplabels.'),
      ),
    );
  },
};

export const WithTitleSlot: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Custom Title Slot)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'both',
          ref: modalRef,
        },
        React.createElement('span', { slot: 'title' }, '⚠️ Important Notice'),
        React.createElement('p', null, 'This modal uses a custom title slot instead of the title property.'),
      ),
    );
  },
};

export const RichContent: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
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
        'Open Modal (Rich Content)',
      ),
      React.createElement(
        'clippy-modal',
        {
          actions: 'both',
          'aria-describedby': 'modal-description',
          'cancel-label': 'Decline',
          'confirm-label': 'Accept',
          ref: modalRef,
          title: 'Terms and Conditions',
        },
        React.createElement('p', { id: 'modal-description' }, 'Please read and accept the following terms:'),
        React.createElement('ul', null, [
          React.createElement('li', { key: '1' }, 'You agree to use this service responsibly'),
          React.createElement('li', { key: '2' }, 'You will not share your credentials'),
          React.createElement('li', { key: '3' }, 'You accept our privacy policy'),
        ]),
        React.createElement('p', null, 'By clicking Accept, you agree to all terms above.'),
      ),
    );
  },
};
