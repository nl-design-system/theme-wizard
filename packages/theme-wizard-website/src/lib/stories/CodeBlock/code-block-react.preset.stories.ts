import type { CodeBlockProps } from '@nl-design-system-candidate/code-block-react';
import {
  createPresetTokens,
  createRelativeFontSizePresetOptions,
  createPresetStory,
  type PresetOption,
} from '../story-helpers';

const codeBlockSampleText = `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`;

const createCodeBlockTokens = (entries: Record<string, string>) => createPresetTokens('nl.code-block', entries);

export const CodeBlockKleur = createPresetStory({
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

export const CodeBlockAfronding = createPresetStory({
  name: 'Vorm',
  args: {
    children: codeBlockSampleText,
  },
  description: 'Selecteer een afronding van de hoeken van het Code Block',
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
  question: 'Kies de afronding van het Code Block',
});

export const CodeBlockPadding = createPresetStory({
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

export const CodeBlockTekstgrootte = createPresetStory({
  name: 'Tekstgrootte',
  args: {
    children: codeBlockSampleText,
  },
  description: 'De tekstgrootte van het code block blijft in verhouding tot de ingestelde paragraph-grootte.',
  options: createRelativeFontSizePresetOptions('nl.code-block.font-size', 'het code block'),
  order: 4,
  question: 'Kies de tekstgrootte van het Code Block',
});

export const CodeBlockLettertype = createPresetStory({
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
  order: 5,
  question: 'Kies de font family van het Code Block',
});
