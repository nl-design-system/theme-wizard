import type { CodeBlockProps } from '@nl-design-system-candidate/code-block-react';
import type { StoryObj } from '@storybook/react-vite';
import { createPresetTokens } from '../story-helpers';

type Story = StoryObj<CodeBlockProps>;

const codeBlockSampleText = `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`;

const createCodeBlockTokens = (entries: Record<string, string>) => createPresetTokens('nl.code-block', entries);

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
      name: 'Aanbevolen',
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
      name: 'Aanbevolen',
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

export const CodeBlockPadding: Story = createPresetStory({
  name: 'Padding',
  args: {
    children: codeBlockSampleText,
  },
  description: 'De verticale ruimte binnen het code block.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Compact',
      description: 'Minder witruimte rondom de code.',
      tokens: createCodeBlockTokens({
        'padding-block': '{basis.space.block.md}',
      }),
    },
    {
      name: 'Ruim',
      description: 'Meer witruimte rondom de code.',
      tokens: createCodeBlockTokens({
        'padding-block': '{basis.space.block.3xl}',
      }),
    },
  ],
  order: 3,
  question: 'Kies de padding van het Code Block',
});

export const CodeBlockLettertype: Story = createPresetStory({
  name: 'Lettertype',
  args: {
    children: codeBlockSampleText,
  },
  description: 'Het lettertype voor code in het code block.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Standaard lettertype',
      description:
        'Gebruik hetzelfde lettertype als de rest van de pagina. Voor als je graag code leest in bijvoorbeeld het "Times New Roman" font.',
      tokens: createCodeBlockTokens({
        'font-family': '{basis.text.font-family.default}',
      }),
    },
  ],
  order: 4,
  question: 'Kies het lettertype van het Code Block',
});
