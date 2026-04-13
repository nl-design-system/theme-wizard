import type { NumberBadgeProps } from '@nl-design-system-candidate/number-badge-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<NumberBadgeProps>;

const tokenValue = (value: string) => ({ $value: value });

const createNumberBadgeEditableTokens = (tokenNames: string[]) => ({
  nl: {
    'number-badge': Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
  },
});

const createAdvancedStory = ({
  name,
  args,
  description,
  order,
  question,
  tokenNames,
}: {
  args: NumberBadgeProps;
  description: string;
  name: string;
  order: number;
  question: string;
  tokenNames: string[];
}): Story => ({
  name,
  args,
  parameters: {
    designStory: true,
    editableTokens: createNumberBadgeEditableTokens(tokenNames),
    wizard: {
      description,
      order,
      question,
      type: 'advanced',
    },
  },
});

const defaultArgs = {
  children: '42',
  label: '42 ongelezen berichten',
};

export const AdvancedNumberBadgeTypography: Story = createAdvancedStory({
  name: 'Number Badge Typography',
  args: defaultArgs,
  description: 'Gebruik deze geavanceerde instelling alleen als je de tekstdikte precies wilt instellen.',
  order: 8,
  question: 'Wil je de typografie van de Number Badge verder verfijnen?',
  tokenNames: ['font-weight'],
});
