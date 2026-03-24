import type { HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';
import {
  headingWizardStepColor,
  headingWizardStepFontSize,
  headingWizardStepTypography,
} from './heading-react.story-helpers';

type Story = StoryObj<HeadingProps>;

const tokenValue = (value: string) => ({ $value: value });

const createHeadingEditableTokens = (level: number, tokenNames: string[]) => ({
  nl: {
    heading: {
      [`level-${level}`]: Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
    },
  },
});

const createAdvancedStory = ({
  name,
  args,
  description,
  level,
  question,
  tokenNames,
  wizardStep,
}: {
  args: HeadingProps;
  description: string;
  level: number;
  name: string;
  question: string;
  tokenNames: string[];
  wizardStep: Record<string, unknown>;
}): Story => ({
  name,
  args,
  parameters: {
    designStory: true,
    editableTokens: createHeadingEditableTokens(level, tokenNames),
    wizard: {
      ...wizardStep,
      description,
      question,
    },
  },
});

export const DesignHeading1FontSize: Story = createAdvancedStory({
  name: 'Design: Heading 1 font-size',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 1,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H1-grootte precies wilt bijsturen.',
  level: 1,
  question: 'Wil je de grootte van de H1 verder verfijnen?',
  tokenNames: ['font-size', 'line-height'],
  wizardStep: headingWizardStepFontSize,
});

export const DesignHeadingColor: Story = createAdvancedStory({
  name: 'Design: Heading kleur',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 1,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de kleur van headings handmatig wilt afstemmen.',
  level: 1,
  question: 'Wil je de kleur van headings verder verfijnen?',
  tokenNames: ['color'],
  wizardStep: headingWizardStepColor,
});

export const DesignHeadingTypography: Story = createAdvancedStory({
  name: 'Design: Heading typografie',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 1,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je lettertype of gewicht precies wilt bijsturen.',
  level: 1,
  question: 'Wil je de typografie van headings verder verfijnen?',
  tokenNames: ['font-family', 'font-weight'],
  wizardStep: headingWizardStepTypography,
});
