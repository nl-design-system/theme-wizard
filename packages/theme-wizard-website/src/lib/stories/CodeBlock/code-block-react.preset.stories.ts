import type { CodeBlockProps } from '@nl-design-system-candidate/code-block-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<CodeBlockProps>;

const tokenValue = (value: string) => ({ $value: value });

const codeBlockSampleText = `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`;

const createCodeBlockTokens = (tokenEntries: Record<string, string>) => ({
  nl: {
    'code-block': Object.fromEntries(
      Object.entries(tokenEntries).map(([key, value]) => [key, tokenValue(value)]),
    ),
  },
});

const createPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  question,
}: {
  args: CodeBlockProps;
  description?: string;
  name: string;
  options: Array<{ description: string; name: string; tokens: Record<string, unknown> | null }>;
  order: number;
  question: string;
}): Story => ({
  name,
  args,
  parameters: {
    presets: [
      {
        ...(description ? { description } : {}),
        name: question,
        options,
      },
    ],
    wizard: {
      order,
      previewStoryIds: ['WizardPreview'],
      type: 'preset',
    },
  },
});

export const CodeBlockKleur: Story = createPresetStory({
  name: 'Kleur',
  args: {
    children: codeBlockSampleText,
  },
  description: 'De achtergrondkleur en tekstkleur bepalen hoe het code block eruitziet in de interface.',
  options: [
    {
      name: 'Startthema',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Omgekeerd',
      description: 'Gebruikt een donkere achtergrond met lichte tekst.',
      tokens: createCodeBlockTokens({
        'background-color': '{basis.color.default.color-document}',
        color: '{basis.color.default.bg-default}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de kleur voor het Code Block',
});

export const CodeBlockVorm: Story = createPresetStory({
  name: 'Vorm',
  args: {
    children: codeBlockSampleText,
  },
  options: [
    {
      name: 'Startthema',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Afgerond',
      description: 'Subtiel afgeronde hoeken.',
      tokens: createCodeBlockTokens({
        'border-radius': '{basis.border-radius.md}',
      }),
    },
    {
      name: 'Sterk afgerond',
      description: 'Volledig afgeronde hoeken.',
      tokens: createCodeBlockTokens({
        'border-radius': '{basis.border-radius.round}',
      }),
    },
    {
      name: 'Rechthoekig',
      description: 'Geen afgeronde hoeken.',
      tokens: createCodeBlockTokens({
        'border-radius': '0',
      }),
    },
  ],
  order: 2,
  question: 'Kies de vorm van het Code Block',
});
