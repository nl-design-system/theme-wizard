import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/src/clippy-link/index.ts';
import readme from '@nl-design-system-community/clippy-components/src/clippy-link/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type ForwardAttributes = 'aria-data' | 'all';

interface LinkStoryArgs {
  ariaLabel: string;
  className: string;
  content: string;
  ariaCurrent: string;
  dataTestid: string;
  disabled: boolean;
  forwardAttributes: ForwardAttributes;
  href: string;
  inlineBox: boolean;
  rel: string;
  target: string;
  restDownload: string;
  restHreflang: string;
  restPing: string;
  restReferrerPolicy: string;
  restType: string;
}

const createTemplate = (args: LinkStoryArgs) => {
  const inlineBox = args.inlineBox ? ' inline-box' : '';
  const disabled = args.disabled ? ' disabled' : '';
  const forwardAttributes = args.forwardAttributes === 'all' ? ' forward-attributes="all"' : '';
  const href = args.href ? ` href="${args.href}"` : '';
  const target = args.target ? ` target="${args.target}"` : '';
  const rel = args.rel ? ` rel="${args.rel}"` : '';
  const ariaCurrent = args.ariaCurrent ? ` aria-current="${args.ariaCurrent}"` : '';
  const className = args.className ? ` class="${args.className}"` : '';
  const ariaLabel = args.ariaLabel ? ` aria-label="${args.ariaLabel}"` : '';
  const dataTestid = args.dataTestid ? ` data-testid="${args.dataTestid}"` : '';
  const restDownload = args.restDownload ? ` rest-download="${args.restDownload}"` : '';
  const restHreflang = args.restHreflang ? ` rest-hreflang="${args.restHreflang}"` : '';
  const restPing = args.restPing ? ` rest-ping="${args.restPing}"` : '';
  const restReferrerPolicy = args.restReferrerPolicy ? ` rest-referrer-policy="${args.restReferrerPolicy}"` : '';
  const restType = args.restType ? ` rest-type="${args.restType}"` : '';

  return html`<clippy-link${href}${target}${rel}${ariaCurrent}${inlineBox}${disabled}${forwardAttributes}${className}${ariaLabel}${dataTestid}${restDownload}${restHreflang}${restPing}${restReferrerPolicy}${restType}>${args.content}</clippy-link>`;
};

type ClippyLinkElement = HTMLElement & {
  ariaCurrent: string;
  disabled: boolean;
  href: string;
  rel: string;
  target: string;
  className: string;
  restProps: {
    download?: string;
    hreflang?: string;
    ping?: string;
    referrerPolicy?: string;
    type?: string;
  };
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

  if (args.className) el.setAttribute('class', args.className);
  else el.removeAttribute('class');

  if (args.disabled) el.setAttribute('disabled', '');
  else el.removeAttribute('disabled');

  el.toggleAttribute('inline-box', args.inlineBox);
  if (args.forwardAttributes === 'all') el.setAttribute('forward-attributes', 'all');
  else el.removeAttribute('forward-attributes');

  if (args.ariaLabel) el.setAttribute('aria-label', args.ariaLabel);
  else el.removeAttribute('aria-label');

  if (args.dataTestid) el.dataset['testid'] = args.dataTestid;
  else delete el.dataset['testid'];

  el.restProps = {
    download: args.restDownload || undefined,
    hreflang: args.restHreflang || undefined,
    ping: args.restPing || undefined,
    referrerPolicy: args.restReferrerPolicy || undefined,
    type: args.restType || undefined,
  };
};

const ClippyLinkStory = (args: LinkStoryArgs) => {
  const ref = React.useRef<ClippyLinkElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    syncClippyLink(el, args);
  }, [
    args.ariaLabel,
    args.className,
    args.ariaCurrent,
    args.dataTestid,
    args.disabled,
    args.forwardAttributes,
    args.href,
    args.inlineBox,
    args.rel,
    args.target,
    args.restDownload,
    args.restHreflang,
    args.restPing,
    args.restReferrerPolicy,
    args.restType,
  ]);

  return React.createElement('clippy-link', { ref }, args.content);
};

const meta = {
  id: 'clippy-link',
  args: {
    ariaCurrent: '',
    ariaLabel: 'Meer info',
    className: '',
    content: 'Voorbeeldsite',
    dataTestid: 'link',
    disabled: false,
    forwardAttributes: 'aria-data',
    href: 'https://example.com',
    inlineBox: false,
    rel: 'noopener noreferrer',
    restDownload: '',
    restHreflang: '',
    restPing: '',
    restReferrerPolicy: '',
    restType: '',
    target: '_blank',
  },
  argTypes: {
    ariaCurrent: {
      name: 'aria-current',
      defaultValue: '',
      description: 'Marks the link as current; used for styling and forwarded to the inner <a>.',
      type: {
        name: 'string',
        required: false,
      },
    },
    ariaLabel: {
      name: 'aria-label',
      defaultValue: '',
      description: 'Forwarded to the rendered <a> (when forward-attributes allows it)',
      type: {
        name: 'string',
        required: false,
      },
    },
    className: {
      name: 'class',
      defaultValue: '',
      description: 'Extra class applied to the host element (forwarded to <a> via class attribute)',
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
    dataTestid: {
      name: 'data-testid',
      defaultValue: '',
      description: 'Forwarded to the rendered <a> (when forward-attributes allows it)',
      type: {
        name: 'string',
        required: false,
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
    forwardAttributes: {
      name: 'Forward attributes',
      control: { type: 'select' },
      defaultValue: 'aria-data',
      description: 'Which host attributes are forwarded to the inner <a>',
      options: ['aria-data', 'all'] satisfies ForwardAttributes[],
      type: {
        name: 'string',
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
    restDownload: {
      name: 'restProps.download',
      defaultValue: '',
      description: 'Property-only forwarded to the inner <a> (download)',
      type: {
        name: 'string',
        required: false,
      },
    },
    restHreflang: {
      name: 'restProps.hreflang',
      defaultValue: '',
      description: 'Property-only forwarded to the inner <a> (hreflang)',
      type: {
        name: 'string',
        required: false,
      },
    },
    restPing: {
      name: 'restProps.ping',
      defaultValue: '',
      description: 'Property-only forwarded to the inner <a> (ping)',
      type: {
        name: 'string',
        required: false,
      },
    },
    restReferrerPolicy: {
      name: 'restProps.referrerPolicy',
      defaultValue: '',
      description: 'Property-only forwarded to the inner <a> (referrerPolicy)',
      type: {
        name: 'string',
        required: false,
      },
    },
    restType: {
      name: 'restProps.type',
      defaultValue: '',
      description: 'Property-only forwarded to the inner <a> (type)',
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
