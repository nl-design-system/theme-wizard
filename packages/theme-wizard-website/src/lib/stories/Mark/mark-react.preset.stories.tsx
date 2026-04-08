import type { MarkProps } from '@nl-design-system-candidate/mark-react';
import { createPresetTokens, createPresetStory, type PresetOption } from '../story-helpers';


const createMarkTokens = (entries: Record<string, string>) => createPresetTokens('nl.mark', entries);


const defaultArgs = {
  children: 'Gemarkeerde tekst',
};

export const MarkKleur = createPresetStory({
  name: 'Kleur',
  args: defaultArgs,
  description: 'De achtergrondkleur en tekstkleur bepalen hoe sterk gemarkeerde tekst opvalt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Markergeel',
      description: 'Gebruik de highlightkleur.',
      tokens: createMarkTokens({
        'background-color': '{basis.color.highlight.bg-default}',
        color: '{basis.color.highlight.color-default}',
      }),
    },
    {
      name: 'Accent',
      description: 'Gebruik een accentkleur om markering extra te laten opvallen.',
      tokens: createMarkTokens({
        'background-color': '{basis.color.accent-1.bg-default}',
        color: '{basis.color.accent-1.color-default}',
      }),
    },
    {
      name: 'Subtiel',
      description: 'Gebruik een rustige markering met minder contrast.',
      tokens: createMarkTokens({
        'background-color': '{basis.color.default.bg-subtle}',
        color: '{basis.color.default.color-default}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de kleur van Mark',
});
