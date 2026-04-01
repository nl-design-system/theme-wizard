import type { CodeBlockProps } from '@nl-design-system-candidate/code-block-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<CodeBlockProps>;

const tokenValue = (value: string) => ({ $value: value });

const codeBlockSampleText = `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`;

const createCodeBlockEditableTokens = (tokenNames: string[]) => ({
  nl: {
    'code-block': Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
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
  args: CodeBlockProps;
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
    editableTokens: createCodeBlockEditableTokens(tokenNames),
    wizard: {
      description,
      order,
      question,
      step: 'code-block:advanced',
      stepTitle: 'Code Block geavanceerd',
      type: 'advanced',
    },
  },
});

export const AdvancedCodeBlockSize: Story = createAdvancedStory({
  name: 'Code Block Size',
  args: {
    children: codeBlockSampleText,
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je het code block compacter of ruimer wilt afstellen.',
  order: 3,
  question: 'Wil je de grootte van het Code Block verder verfijnen?',
  tokenNames: ['padding-block', 'padding-inline'],
});

export const AdvancedCodeBlockTypography: Story = createAdvancedStory({
  name: 'Code Block Typography',
  args: {
    children: codeBlockSampleText,
  },
  description:
    'Gebruik deze geavanceerde instellingen alleen als je lettertype, grootte of regelhoogte precies wilt bijsturen.',
  order: 4,
  question: 'Wil je de typografie van het Code Block verder verfijnen?',
  tokenNames: ['font-family', 'font-size', 'line-height'],
});

export const AdvancedCodeBlockColor: Story = createAdvancedStory({
  name: 'Code Block Color',
  args: {
    children: codeBlockSampleText,
  },
  description:
    'Gebruik deze geavanceerde instellingen alleen als je de achtergrondkleur of tekstkleur handmatig wilt afstemmen.',
  order: 5,
  question: 'Wil je de kleurinstellingen van het Code Block verder verfijnen?',
  tokenNames: ['background-color', 'color'],
});

export const AdvancedCodeBlockBorder: Story = createAdvancedStory({
  name: 'Code Block Border',
  args: {
    children: codeBlockSampleText,
  },
  description:
    'Gebruik deze geavanceerde instellingen alleen als je de afronding precies wilt instellen.',
  order: 6,
  question: 'Wil je de rand en afronding van het Code Block verder verfijnen?',
  tokenNames: ['border-color', 'border-radius', 'border-width'],
});
