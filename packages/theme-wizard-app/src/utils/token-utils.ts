import { type ModernDimensionValue } from '@nl-design-system-community/design-tokens-schema';

export const PX_PER_REM = 16;

export const dimensionToPx = (value: ModernDimensionValue) => {
  const normalized = { ...value };
  if (normalized.unit === 'rem') {
    normalized.unit = 'px';
    normalized.value = normalized.value * PX_PER_REM;
  }
  return normalized;
};
