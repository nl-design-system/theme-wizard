import type { SkipLinkProps } from '@nl-design-system-candidate/skip-link-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<SkipLinkProps>;

const tokenValue = (value: string) => ({ $value: value });

const createSkipLinkEditableTokens = (tokenNames: string[]) => ({
  nl: {
    'skip-link': Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
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
  args: SkipLinkProps;
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
    editableTokens: createSkipLinkEditableTokens(tokenNames),
    wizard: {
      description,
      order,
      question,
      type: 'advanced',
    },
  },
});

const defaultArgs = {
  children: 'Naar de inhoud',
  className: 'nl-skip-link--visible',
  href: '#inhoud',
  style: {
    position: 'static' as const,
  },
};

export const AdvancedSkipLinkTypography: Story = createAdvancedStory({
  name: 'Skip Link Typography',
  args: defaultArgs,
  description:
    'Gebruik deze geavanceerde instellingen alleen als je regelhoogte of onderstreping precies wilt afstellen.',
  order: 5,
  question: 'Wil je de typografie van de Skip Link verder verfijnen?',
  tokenNames: ['line-height', 'text-decoration-thickness', 'text-underline-offset'],
});
