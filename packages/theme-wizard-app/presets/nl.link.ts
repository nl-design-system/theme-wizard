import type { BasisColorName, ForegroundColorKey } from '@nl-design-system-community/design-tokens-schema';
import type { TokenPreset } from '../src/utils/token-presets';

const colorRef = (group: BasisColorName, key: ForegroundColorKey) => ({
  $type: 'color',
  $value: `{basis.color.${group}.${key}}`,
});

const createPreset = (group: BasisColorName): TokenPreset => ({
  name: group,
  tokens: {
    nl: {
      link: {
        active: {
          color: colorRef(group, 'color-active'),
        },
        color: colorRef(group, 'color-default'),
        hover: {
          color: colorRef(group, 'color-hover'),
        },
        'text-decoration-color': colorRef(group, 'color-default'),
      },
    },
  },
});

const groups: BasisColorName[] = ['accent-1', 'accent-2', 'action-1', 'action-2'];

export default groups.map(createPreset);
