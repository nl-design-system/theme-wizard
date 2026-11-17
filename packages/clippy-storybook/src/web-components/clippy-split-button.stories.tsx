import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-icon';
import '@nl-design-system-community/clippy-components/clippy-split-button';
import '@nl-design-system-candidate/button-css/button.css';
import readme from '@nl-design-system-community/clippy-components/src/clippy-split-button/README.md?raw';
import React, { useEffect, useRef, useState } from 'react';

type Purpose = 'primary' | 'secondary';

type StoryArgs = {
  startPurpose: Purpose;
  endPurpose: Purpose;
  menuItems: string[];
  open: boolean;
  endDisabled: boolean;
};

const labels: Record<Purpose, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
};

const chevronDown =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6l6 -6" /></svg>';

const menuItemStyle = {
  '--nl-button-border-radius': 'var(--clippy-split-button-menu-item-border-radius)',
  inlineSize: '100%',
  justifyContent: 'flex-start',
  whiteSpace: 'nowrap',
} as React.CSSProperties;

const SplitButtonDemo = ({ args }: { args: StoryArgs }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const menu = menuRef.current!;
    const onToggle = (event: Event) => setOpen((event as ToggleEvent).newState === 'open');
    menu.addEventListener('toggle', onToggle);
    if (args.open) menu.showPopover();
    return () => menu.removeEventListener('toggle', onToggle);
  }, [args.open]);

  return React.createElement(
    'clippy-split-button',
    null,
    React.createElement('clippy-button', { purpose: args.startPurpose, slot: 'start' }, labels[args.startPurpose]),
    React.createElement(
      'clippy-button',
      {
        controls: 'split-button-menu',
        disabled: args.endDisabled,
        expanded: open || undefined,
        'icon-only': true,
        onClick: () => {
          if (!args.endDisabled && !wasOpenRef.current) menuRef.current?.showPopover();
        },
        onPointerDown: () => {
          wasOpenRef.current = menuRef.current?.matches(':popover-open') ?? false;
        },
        purpose: args.endPurpose,
        slot: 'end',
      },
      React.createElement('clippy-icon', { dangerouslySetInnerHTML: { __html: chevronDown }, slot: 'iconStart' }),
      labels[args.endPurpose],
    ),
    React.createElement(
      'ul',
      { id: 'split-button-menu', popover: 'auto', ref: menuRef, slot: 'menu' },
      args.menuItems.map((item) =>
        React.createElement(
          'li',
          { key: item },
          React.createElement(
            'button',
            {
              className: 'nl-button nl-button--subtle',
              onClick: () => menuRef.current?.hidePopover(),
              style: menuItemStyle,
              type: 'button',
            },
            item,
          ),
        ),
      ),
    ),
  );
};

const meta = {
  id: 'clippy-split-button',
  args: {
    endDisabled: false,
    endPurpose: 'primary',
    menuItems: ['Action one', 'Action two'],
    open: false,
    startPurpose: 'primary',
  },
  argTypes: {
    endDisabled: {
      control: 'boolean',
      description: 'Disables the end button',
    },
    endPurpose: {
      control: 'select',
      description: 'Purpose of the end button',
      options: ['primary', 'secondary'],
    },
    open: {
      control: 'boolean',
      description: 'Whether the menu is open initially',
    },
    startPurpose: {
      control: 'select',
      description: 'Purpose of the start button; only `primary` gets a dividing line',
      options: ['primary', 'secondary'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        code: `<clippy-split-button>
  <clippy-button slot="start" purpose="primary">Primary</clippy-button>
  <clippy-button slot="end" purpose="primary" icon-only controls="menu">
    <clippy-icon slot="iconStart"><svg>…</svg></clippy-icon>
    Primary
  </clippy-button>
  <ul slot="menu" id="menu" popover>
    <li><button class="nl-button nl-button--subtle" type="button">Action one</button></li>
  </ul>
</clippy-split-button>`,
        type: 'code',
      },
    },
  },
  render: (args: StoryArgs) =>
    React.createElement(
      'div',
      { style: { minBlockSize: '10rem' } },
      React.createElement(SplitButtonDemo, { args, key: String(args.open) }),
    ),
  tags: ['autodocs'],
  title: 'Clippy/Split Button',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const MenuOpen: Story = {
  name: 'Menu Open',
  args: {
    open: true,
  },
};

export const SecondaryPurpose: Story = {
  name: 'Secondary Purpose',
  args: {
    endPurpose: 'secondary',
    startPurpose: 'secondary',
  },
};

export const DisabledEnd: Story = {
  name: 'Disabled End',
  args: {
    endDisabled: true,
  },
};

export const MixedPurpose: Story = {
  name: 'Mixed Purpose',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `<clippy-split-button>
  <clippy-button slot="start" purpose="primary">Primary</clippy-button>
  <clippy-button slot="end" purpose="secondary">Secondary</clippy-button>
</clippy-split-button>`,
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-split-button',
      null,
      React.createElement('clippy-button', { purpose: 'primary', slot: 'start' }, 'Primary'),
      React.createElement('clippy-button', { purpose: 'secondary', slot: 'end' }, 'Secondary'),
    ),
};
