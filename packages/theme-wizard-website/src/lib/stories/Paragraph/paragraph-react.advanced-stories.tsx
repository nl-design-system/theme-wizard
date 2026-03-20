import type { StoryObj } from '@storybook/react-vite';
import { Paragraph, type ParagraphProps } from '@nl-design-system-candidate/paragraph-react';
import {
  paragraphWizardStepDefault,
  paragraphWizardStepLead,
  paragraphWizardStepShared,
} from './paragraph-react.story-helpers';

type Story = StoryObj<ParagraphProps>;

export const DesignParagraphShared: Story = {
  name: 'Design: Paragraph en Lead Paragraph',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
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
      ...paragraphWizardStepShared,
      description: 'Pas de gedeelde kleur en het lettertype aan voor zowel gewone als lead paragraphs.',
      question: 'Wil je de gedeelde basis van paragraphs verder verfijnen?',
    },
  },
  render: ({ children }) => (
    <>
      <Paragraph purpose="lead">{children}</Paragraph>
      <Paragraph>{children}</Paragraph>
    </>
  ),
};

export const DesignParagraph: Story = {
  name: 'Design: Paragraph',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: undefined,
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        paragraph: {
          'font-size': { $value: '' },
          'font-weight': { $value: '' },
          'line-height': { $value: '' },
          'margin-block-end': { $value: '' },
          'margin-block-start': { $value: '' },
        },
      },
    },
    wizard: {
      ...paragraphWizardStepDefault,
      description: 'Gebruik deze geavanceerde instellingen om de gewone paragraph exact af te stemmen.',
      question: 'Wil je de standaard paragraph verder verfijnen?',
    },
  },
};

export const DesignLead: Story = {
  name: 'Design: Paragraph Lead',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: 'lead',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        paragraph: {
          lead: {
            'font-size': { $value: '' },
            'font-weight': { $value: '' },
            'line-height': { $value: '' },
            'margin-block-end': { $value: '' },
            'margin-block-start': { $value: '' },
          },
        },
      },
    },
    wizard: {
      ...paragraphWizardStepLead,
      description: 'Gebruik deze geavanceerde instellingen om de lead paragraph precies meer of minder nadruk te geven.',
      question: 'Wil je de lead paragraph verder verfijnen?',
    },
  },
};
