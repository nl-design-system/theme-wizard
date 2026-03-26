import {
  type DimensionToken,
  type ModernDimensionValue,
  type ModernDimensionToken,
  EXTENSION_RESOLVED_AS,
  isRef,
  stringifyDimension,
} from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-html-image';

const getActualValue = (token: ModernDimensionToken): ModernDimensionValue => {
  const { $extensions, $value } = token;
  const resolvedAs = $extensions?.[EXTENSION_RESOLVED_AS];
  if (isRef($value)) {
    return resolvedAs as ModernDimensionValue;
  }
  return $value;
};

export const filter = <T extends { value: ModernDimensionToken }>(query: string): ((option: T) => boolean) => {
  return ({ value: token }: T) => {
    const actualValue = getActualValue(token);
    return stringifyDimension(actualValue).toLowerCase().includes(query);
  };
};

export const queryToValue = (query: string): DimensionToken => {
  return { $type: 'dimension', $value: query };
};

export const valueToQuery = <T extends { $value: DimensionToken['$value'] }>({ $value }: T): string => {
  return typeof $value === 'string' ? $value : stringifyDimension($value);
};
