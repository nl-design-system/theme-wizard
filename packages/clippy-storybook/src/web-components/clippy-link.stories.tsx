import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/src/clippy-link/index.ts';
import readme from '@nl-design-system-community/clippy-components/src/clippy-link/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface LinkStoryArgs {
  className: string;
  content: string;
  ariaCurrent: string;
  disabled: boolean;
  href: string;
  inlineBox: boolean;
  rel: string;
  target: string;
}

const createTemplate = (args: LinkStoryArgs) => {
  const inlineBox = args.inlineBox ? ' inline-box' : '';
  const disabled = args.disabled ? ' disabled' : '';
  const href = args.href ? ` href="${args.href}"` : '';
  const target = args.target ? ` target="${args.target}"` : '';
  const rel = args.rel ? ` rel="${args.rel}"` : '';
  const ariaCurrent = args.ariaCurrent ? ` aria-current="${args.ariaCurrent}"` : '';
  const className = args.className ? ` class="${args.className}"` : '';

  return html`<clippy-link${href}${target}${rel}${ariaCurrent}${inlineBox}${disabled}${className}>${args.content}</clippy-link>`;
};

type ClippyLinkElement = HTMLElement & {
  disabled: boolean;
  href: string;
  rel: string;
  target: string;
  className: string;
};

const syncClippyLink = (el: ClippyLinkElement, args: LinkStoryArgs) => {
  el.href = args.href;
  el.target = args.target;
  el.rel = args.rel;
  el.disabled = args.disabled;
  el.className = args.className;

  if (args.href) el.setAttribute('href', args.href);
  else el.removeAttribute('href');

  if (args.target) el.setAttribute('target', args.target);
  else el.removeAttribute('target');

  if (args.rel) el.setAttribute('rel', args.rel);
  else el.removeAttribute('rel');

  if (args.ariaCurrent) el.setAttribute('aria-current', args.ariaCurrent);
  else el.removeAttribute('aria-current');

  if (args.disabled) el.setAttribute('disabled', '');
  else el.removeAttribute('disabled');

  el.toggleAttribute('inline-box', args.inlineBox);
};

const ClippyLinkStory = (args: LinkStoryArgs) => {
  const ref = React.useRef<ClippyLinkElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    syncClippyLink(el, args);
  }, [
    args.className,
    args.ariaCurrent,
    args.disabled,
    args.href,
    args.inlineBox,
    args.rel,
    args.target,
  ]);

  return React.createElement('clippy-link', { ref }, args.content);
};

const meta = {
  id: 'clippy-link',
  args: {
    ariaCurrent: '',
    className: '',
    content: 'Voorbeeldsite',
    disabled: false,
    href: 'https://example.com',
    inlineBox: false,
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  argTypes: {
    ariaCurrent: {
      name: 'aria-current',
      defaultValue: '',
      description: 'Marks the link as current; used for styling and set on the inner <a>.',
      type: {
        name: 'string',
        required: false,
      },
    },
    className: {
      name: 'class',
      defaultValue: '',
      description: 'Extra class applied to the host element and used for the inner <a> styling',
      type: { name: 'string', required: false },
    },
    content: {
      name: 'Content',
      defaultValue: '',
      description: 'Text',
      type: {
        name: 'string',
        required: true,
      },
    },
    disabled: {
      name: 'Disabled',
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Disable link behavior (adds nl-link--disabled class)',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    href: {
      name: 'Href',
      defaultValue: '',
      description: 'URL where the link points to',
      type: {
        name: 'string',
        required: true,
      },
    },
    inlineBox: {
      name: 'Inline box',
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Render as inline-box (adds nl-link--inline-box class)',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    rel: {
      name: 'Rel',
      defaultValue: '',
      description: 'Relationship between the current document and the linked URL',
      type: {
        name: 'string',
        required: false,
      },
    },
    target: {
      name: 'Target',
      defaultValue: '',
      description: 'Where to display the linked URL (e.g. _blank)',
      type: {
        name: 'string',
        required: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: LinkStoryArgs) => React.createElement(ClippyLinkStory, args),
  tags: ['autodocs'],
  title: 'Clippy/Link',
} satisfies Meta<LinkStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Link',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: LinkStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
