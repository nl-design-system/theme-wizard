import type { StoryObj } from '@storybook/react-vite';
import { type LinkProps } from '@nl-design-system-candidate/link-react';

type Story = StoryObj<LinkProps>;

export const AdvancedLinkStates: Story = {
  name: 'Link states',
  args: {
    children: 'example.com',
    href: 'https://example.com/',
  },
  parameters: {
    designStory: true,
    editableTokens: {
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
    wizard: {
      description: 'Gebruik deze geavanceerde instellingen om de linkstates en onderstreping precies af te stemmen.',
      order: 3,
      previewStoryIds: ['WizardPreview'],
      question: 'Wil je de linkstates verder verfijnen?',
      step: 'link:advanced',
      stepTitle: 'Link geavanceerd',
      type: 'advanced',
    },
  },
};

export const AdvancedLinkDisabled: Story = {
  name: 'Disabled Link',
  args: {
    children: 'voorbeeldsite',
    disabled: true,
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    editableTokens: {
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
    wizard: {
      description: 'Gebruik deze geavanceerde instellingen om disabled links precies af te stemmen.',
      order: 4,
      previewStoryIds: ['WizardPreviewDisabled'],
      question: 'Wil je de disabled link verder verfijnen?',
      step: 'link:advanced',
      stepTitle: 'Link geavanceerd',
      type: 'advanced',
    },
  },
};

export const AdvancedLinkCurrent: Story = {
  name: 'Current Link',
  args: {
    children: 'voorbeeldsite',
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        link: {
          current: {
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
    wizard: {
      description: 'Gebruik deze geavanceerde instellingen om current links precies af te stemmen.',
      order: 5,
      previewStoryIds: ['WizardPreviewCurrent'],
      question: 'Wil je de current link verder verfijnen?',
      step: 'link:advanced',
      stepTitle: 'Link geavanceerd',
      type: 'advanced',
    },
  },
};
