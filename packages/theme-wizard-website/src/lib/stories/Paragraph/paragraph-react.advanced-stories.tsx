import type { StoryObj } from '@storybook/react-vite';
import { Paragraph, type ParagraphProps } from '@nl-design-system-candidate/paragraph-react';
import { storySampleText } from '../story-helpers';

type Story = StoryObj<ParagraphProps>;

export const AdvancedParagraphShared: Story = {
  name: 'Advanced: Paragraph en Lead Paragraph',
  args: {
    children: storySampleText,
    purpose: undefined,
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        paragraph: {
          color: { $value: '' },
          'font-family': { $value: '' },
        },
      },
    },
    wizard: {
      description: 'Pas de gedeelde kleur en het lettertype aan voor zowel gewone als lead paragraphs.',
      order: 4,
      question: 'Wil je de gedeelde basis van paragraphs verder verfijnen?',
      step: 'paragraph:advanced',
      stepTitle: 'Paragraph geavanceerd',
      type: 'advanced',
    },
  },
  render: ({ children }) => (
    <>
      <Paragraph purpose="lead">{children}</Paragraph>
      <Paragraph>{children}</Paragraph>
    </>
  ),
};

export const AdvancedParagraph: Story = {
  name: 'Advanced: Paragraph',
  args: {
    children: storySampleText,
    purpose: undefined,
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        paragraph: {
          'font-weight': { $value: '' },
          'line-height': { $value: '' },
          'margin-block-end': { $value: '' },
          'margin-block-start': { $value: '' },
        },
      },
    },
    wizard: {
      description: 'Gebruik deze geavanceerde instellingen om de gewone paragraph exact af te stemmen.',
      order: 5,
      question: 'Wil je de standaard paragraph verder verfijnen?',
      step: 'paragraph:advanced',
      stepTitle: 'Paragraph geavanceerd',
      type: 'advanced',
    },
  },
};

export const AdvancedLead: Story = {
  name: 'Advanced: Paragraph Lead',
  args: {
    children: storySampleText,
    purpose: 'lead',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        paragraph: {
          lead: {
            'font-weight': { $value: '' },
            'line-height': { $value: '' },
            'margin-block-end': { $value: '' },
            'margin-block-start': { $value: '' },
          },
        },
      },
    },
    wizard: {
      description:
        'Gebruik deze geavanceerde instellingen om de lead paragraph precies meer of minder nadruk te geven.',
      order: 6,
      question: 'Wil je de lead paragraph verder verfijnen?',
      step: 'paragraph:advanced',
      stepTitle: 'Paragraph geavanceerd',
      type: 'advanced',
    },
  },
};
