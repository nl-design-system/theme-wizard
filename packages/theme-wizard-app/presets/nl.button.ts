import type { BasisColorName } from '@nl-design-system-community/design-tokens-schema';
import type { TokenPreset } from '../src/utils/token-presets';

type State = 'default' | 'hover' | 'active';

const colorRef = (group: BasisColorName, key: string) => ({
  $type: 'color',
  $value: `{basis.color.${group}.${key}}`,
});

const stateTokens = (group: BasisColorName, state: State) => ({
  'background-color': colorRef(group, `bg-${state}`),
  'border-color': colorRef(group, `border-${state}`),
  color: colorRef(group, `color-${state}`),
});

// `interactionGroup` colors the hover and active states, defaults to `group`
const createPreset = (group: BasisColorName, interactionGroup: BasisColorName = group): TokenPreset => ({
  name: interactionGroup === group ? group : `${group} / ${interactionGroup}`,
  tokens: {
    nl: {
      button: {
        primary: {
          ...stateTokens(group, 'default'),
          active: stateTokens(interactionGroup, 'active'),
          hover: stateTokens(interactionGroup, 'hover'),
        },
      },
    },
  },
});

const groups: BasisColorName[] = [
  'accent-1',
  'accent-1-inverse',
  'accent-2',
  'accent-2-inverse',
  'action-1',
  'action-1-inverse',
  'action-2',
  'action-2-inverse',
];

export default [...groups.map((group) => createPreset(group)), createPreset('action-1', 'action-1-inverse')];
