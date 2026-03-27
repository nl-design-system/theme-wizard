import type { HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';
import { createHeadingEditableTokens, headingSampleText } from './heading-react.story-helpers';

type Story = StoryObj<HeadingProps>;

const createAdvancedStory = ({
  name,
  args,
  description,
  level,
  order,
  question,
  tokenNames,
}: {
  args: HeadingProps;
  description: string;
  level: number;
  name: string;
  order: number;
  question: string;
  tokenNames: string[];
}): Story => ({
  name,
  args,
  parameters: {
    designStory: true,
    editableTokens: createHeadingEditableTokens(level, tokenNames),
    wizard: {
      description,
      order,
      question,
      step: 'heading:advanced',
      stepTitle: 'Heading geavanceerd',
      type: 'advanced',
    },
  },
});

export const AdvancedHeading1: Story = createAdvancedStory({
  name: 'Advanced: Heading 1',
  args: {
    children: headingSampleText,
    level: 1,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H1-grootte precies wilt bijsturen.',
  level: 1,
  order: 13,
  question: 'Wil je de H1 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});

export const AdvancedHeading2: Story = createAdvancedStory({
  name: 'Advanced: Heading 2',
  args: {
    children: headingSampleText,
    level: 2,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H2-grootte precies wilt bijsturen.',
  level: 2,
  order: 14,
  question: 'Wil je de H2 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});

export const AdvancedHeading3: Story = createAdvancedStory({
  name: 'Advanced: Heading 3',
  args: {
    children: headingSampleText,
    level: 3,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H3-grootte precies wilt bijsturen.',
  level: 3,
  order: 15,
  question: 'Wil je de H3 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});

export const AdvancedHeading4: Story = createAdvancedStory({
  name: 'Advanced: Heading 4',
  args: {
    children: headingSampleText,
    level: 4,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H4-grootte precies wilt bijsturen.',
  level: 4,
  order: 16,
  question: 'Wil je de H4 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});

export const AdvancedHeading5: Story = createAdvancedStory({
  name: 'Advanced: Heading 5',
  args: {
    children: headingSampleText,
    level: 5,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H5-grootte precies wilt bijsturen.',
  level: 5,
  order: 17,
  question: 'Wil je de H5 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});

export const AdvancedHeading6: Story = createAdvancedStory({
  name: 'Advanced: Heading 6',
  args: {
    children: headingSampleText,
    level: 6,
  },
  description: 'Gebruik deze geavanceerde instelling alleen als je de H6-grootte precies wilt bijsturen.',
  level: 6,
  order: 18,
  question: 'Wil je de H6 verder verfijnen?',
  tokenNames: ['color', 'line-height', 'font-family', 'font-weight'],
});
