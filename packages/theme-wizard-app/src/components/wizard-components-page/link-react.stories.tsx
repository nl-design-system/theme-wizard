import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Decorator } from '@storybook/react-vite';
// import { getExternalLinks } from '../src/helpers/external-links';
import description from '@nl-design-system-candidate/link-docs/docs/description.md?raw';
import linkMeta from '@nl-design-system-candidate/link-docs/stories/link.react.meta';
import * as Stories from '@nl-design-system-candidate/link-docs/stories/link.stories';
// import packageJSON from '../../components-react/link-react/package.json';
import { Link as LinkComponent, LinkProps } from '@nl-design-system-candidate/link-react';
// import { ExampleBodyTextDecorator } from '@nl-design-system-candidate/storybook-shared/src/ExampleBodyTextDecorator';
// import { ParagraphDecorator } from '@nl-design-system-candidate/storybook-shared/src/ParagraphDecorator';
// const externalLinks = getExternalLinks('https://nldesignsystem.nl/link', packageJSON.homepage);
// import '../../components-css/paragraph-css/src/paragraph.scss';
import tokens from '@nl-design-system-candidate/link-tokens';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';

const ParagraphDecorator: Decorator = (StoryEl) => (
  <Paragraph>
    <StoryEl />
  </Paragraph>
);

const ExampleBodyTextDecorator: Decorator = (StoryEl) => (
  <div className="example-body-text">
    <StoryEl />
  </div>
);

const meta: Meta<typeof LinkComponent> = {
  ...linkMeta,
  id: 'link',
  decorators: [ParagraphDecorator, ExampleBodyTextDecorator],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
    tokens,
  },
  title: 'React Componenten/Link',
} satisfies Meta<typeof LinkComponent>;

export default meta;

type Story = StoryObj<LinkProps>;
export const Link: Story = Stories.Link;
export const LinkInEenParagraph: Story = Stories.LinkInEenParagraph;

// Copied from https://github.com/frameless/candidate/blob/main/packages/docs/link-docs/stories/link.stories.tsx#L46
const RenderLinkStates = ({ ...props }: LinkProps) => (
  <>
    <LinkComponent {...props} />
    {' → :hover → '}
    <LinkComponent {...props} className="nl-link--hover" />
    {' → :active → '}
    <LinkComponent {...props} className="nl-link--active" />
  </>
);

export const DesignLinkStates: Story = {
  name: 'Design: Link States',
  args: {
    children: 'example.com',
    href: 'https://example.com/',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        link: {
          active: {
            color: {
              $value: '0',
            },
          },
          color: {
            $value: '0',
          },
          hover: {
            color: {
              $value: '0',
            },
            'text-decoration-line': {
              $value: '0',
            },
            'text-decoration-thickness': {
              $value: '0',
            },
          },
          'text-decoration-color': {
            $value: '0',
          },
          'text-decoration-line': {
            $value: '0',
          },
          'text-decoration-thickness': {
            $value: '0',
          },
          'text-underline-offset': {
            $value: '0',
          },
        },
      },
    },
  },
  render: RenderLinkStates,
};
export const DesignLinkDisabled: Story = {
  name: 'Design: Disabled Link',
  args: {
    children: 'voorbeeldsite',
    disabled: true,
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: 'Een disabled link',
      },
    },
    tokens: {
      nl: {
        link: {
          disabled: {
            color: {
              $value: '',
            },
            cursor: {
              $value: '',
            },
          },
        },
      },
    },
  },
};
export const DesignLinkCurrent: Story = {
  name: 'Design: Current Link',
  args: {
    children: 'voorbeeldsite',
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: 'Een current link',
      },
    },
    tokens: {
      nl: {
        link: {
          current: {
            cursor: {
              $value: '',
            },
          },
        },
      },
    },
  },
};
