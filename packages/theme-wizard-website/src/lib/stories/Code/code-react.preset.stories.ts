import { createPresetTokens, createRelativeFontSizePresetOptions, createPresetStory } from '../story-helpers';

const codeSampleText = `import { Code } from '@nl-design-system-candidate/code-react';`;

const createCodeTokens = (entries: Record<string, string>) => createPresetTokens('nl.code', entries);

export const CodeFontSize = createPresetStory({
  name: 'Font size',
  args: {
    children: codeSampleText,
  },
  description: 'De grootte van inline code blijft in verhouding tot de ingestelde paragraph-grootte.',
  options: createRelativeFontSizePresetOptions('nl.code.font-size', 'inline code'),
  order: 1,
  question: 'Kies de grootte van inline code',
});

export const CodeFontFamily = createPresetStory({
  name: 'Font family',
  args: {
    children: codeSampleText,
  },
  description: 'Kies of inline code een monospace-lettertype houdt of juist het documentlettertype volgt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Documentlettertype',
      description: 'Gebruik hetzelfde lettertype als de rest van de pagina.',
      tokens: createCodeTokens({
        'font-family': '{basis.text.font-family.default}',
      }),
    },
  ],
  order: 2,
  question: 'Kies het lettertype van inline code',
});

export const CodeColor = createPresetStory({
  name: 'Kleur',
  args: {
    children: codeSampleText,
  },
  description: 'De tekstkleur bepaalt hoeveel contrast en nadruk inline code krijgt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Zacht',
      description: 'Gebruik een minder nadrukkelijke tekstkleur.',
      tokens: createCodeTokens({
        color: '{basis.color.default.color-default}',
      }),
    },
    {
      name: 'Accent',
      description: 'Geef inline code een accentkleur.',
      tokens: createCodeTokens({
        color: '{basis.color.accent-1.color-default}',
      }),
    },
  ],
  order: 3,
  question: 'Kies de tekstkleur van inline code',
});

export const CodeBackgroundColor = createPresetStory({
  name: 'Achtergrondkleur',
  args: {
    children: codeSampleText,
  },
  description: 'De achtergrondkleur bepaalt hoe sterk inline code zich afzet tegen de omliggende tekst.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Subtiel',
      description: 'Gebruik een rustige achtergrondmarkering.',
      tokens: createCodeTokens({
        'background-color': '{basis.color.default.bg-subtle}',
      }),
    },
    {
      name: 'Accent',
      description: 'Gebruik een achtergrond met accentkleur.',
      tokens: createCodeTokens({
        'background-color': '{basis.color.accent-1.bg-subtle}',
      }),
    },
  ],
  order: 4,
  question: 'Kies de achtergrondkleur van inline code',
});
