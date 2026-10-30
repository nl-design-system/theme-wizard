import type { Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import {
  type BaseDesignToken,
  type TokenReference,
  type TokenSubtype,
  EXTENSION_RESOLVED_AS,
  EXTENSION_TOKEN_STAGED,
  extractRef,
  getExtension,
  getTokenSubtype,
  isRef,
  isValueObject,
} from '@nl-design-system-community/design-tokens-schema';
import { flattenTokens } from '../../lib/Theme/lib';

type ReferenceOption = Option & { path: string; staged: boolean; subtype?: TokenSubtype };

// Keyed on the tokens object: Theme replaces it on every change, clone() shares it.
const cache = new WeakMap<object, ReferenceOption[]>();

const toReferenceOption = (path: string, token: BaseDesignToken): ReferenceOption => {
  const $value = `{${path}}` satisfies TokenReference;
  // Show the resolved value in the combobox, also when the option itself is a reference
  const resolved = isRef(token.$value) ? getExtension(token, EXTENSION_RESOLVED_AS) : token.$value;

  return {
    label: extractRef($value),
    path,
    staged: getExtension(token, EXTENSION_TOKEN_STAGED) !== false,
    subtype: getTokenSubtype(token),
    value: {
      $extensions: {
        ...token.$extensions,
        [EXTENSION_RESOLVED_AS]: structuredClone(resolved),
      },
      $type: token.$type,
      $value,
    },
  };
};

export const getReferenceOptions = (tokens: Record<string, unknown>): ReferenceOption[] => {
  const cached = cache.get(tokens);
  if (cached) {
    return cached;
  }

  const basis = tokens['basis'];
  const options = isValueObject(basis)
    ? Object.entries(flattenTokens(basis, 'basis')).map(([path, token]) => toReferenceOption(path, token))
    : [];
  cache.set(tokens, options);
  return options;
};

export const getOptionsFor = (tokens: Record<string, unknown>, path: string, token: BaseDesignToken): Option[] => {
  const options = getReferenceOptions(tokens);
  // Only tokens before this one may be referenced, to avoid circular references
  const ownIndex = options.findIndex((option) => option.path === path);
  const candidates = ownIndex === -1 ? options : options.slice(0, ownIndex);
  const subtype = getTokenSubtype(token);

  return candidates.filter(
    (option) => option.value.$type === token.$type && option.staged && (!subtype || option.subtype === subtype),
  );
};
