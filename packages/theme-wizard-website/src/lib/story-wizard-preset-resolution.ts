import dlv from 'dlv';
import { presetTokensToStyle, styleObjectToString } from '../../../theme-wizard-app/src/lib/Theme/lib';
import { type DynamicPresetOption, type SelectedPresetOption, type PresetResolutionContext } from './types';

/**
 * Reads the available keys from a token scale in the defaults object.
 *
 * Example input:
 * `defaults = { basis: { text: { 'font-size': { sm: {}, md: {}, lg: {} } } } }`
 * `path = 'basis.text.font-size'`
 *
 * Example return:
 * `['sm', 'md', 'lg']`
 */
const getTokenScale = (defaults: unknown, path: string) => {
  const tokenGroup = dlv(defaults && typeof defaults === 'object' ? defaults : undefined, path);

  if (!tokenGroup || typeof tokenGroup !== 'object' || Array.isArray(tokenGroup)) {
    return [];
  }

  return Object.keys(tokenGroup);
};

/**
 * Reads a `$value` from a nested token object at a dot-path.
 *
 * Example input:
 * `tokens = { nl: { paragraph: { 'font-size': { $value: '{basis.text.font-size.md}' } } } }`
 * `path = 'nl.paragraph.font-size'`
 *
 * Example return:
 * `'{basis.text.font-size.md}'`
 */
const getTokenValueAtPath = (tokens: unknown, path: string) => {
  const token = dlv(tokens && typeof tokens === 'object' ? tokens : undefined, path);

  return token && typeof token === 'object' && '$value' in (token as Record<string, unknown>)
    ? (token as { $value?: unknown }).$value
    : undefined;
};

/**
 * Finds the first selected preset that contains a token reference for a given path.
 *
 * Example input:
 * `selectedOptions = [{ tokens: { nl: { paragraph: { 'font-size': { $value: '{basis.text.font-size.lg}' } } } } }]`
 * `path = 'nl.paragraph.font-size'`
 * `fallbackReference = '{basis.text.font-size.md}'`
 *
 * Example return:
 * `'{basis.text.font-size.lg}'`
 */
const getSelectedTokenReference = (
  selectedOptions: SelectedPresetOption[],
  path: string,
  defaults: unknown,
  fallbackReference: string,
) => {
  for (const option of selectedOptions) {
    const value = getTokenValueAtPath(option?.tokens, path);

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      return value;
    }
  }

  const defaultValue = getTokenValueAtPath(defaults, path);

  if (typeof defaultValue === 'string' && defaultValue.startsWith('{') && defaultValue.endsWith('}')) {
    return defaultValue;
  }

  return fallbackReference;
};

/**
 * Shifts a token reference within a scale by an offset.
 *
 * Example input:
 * `defaults = { basis: { text: { 'font-size': { sm: {}, md: {}, lg: {}, xl: {} } } } }`
 * `reference = '{basis.text.font-size.lg}'`
 * `scalePath = 'basis.text.font-size'`
 * `offset = 1`
 *
 * Example return:
 * `'{basis.text.font-size.xl}'`
 */
const getShiftedScaleReference = (defaults: unknown, reference: string, scalePath: string, offset: number) => {
  const normalizedReference = reference.startsWith('{') && reference.endsWith('}') ? reference.slice(1, -1) : reference;
  const prefix = `${scalePath}.`;

  if (!normalizedReference.startsWith(prefix)) {
    return reference;
  }

  const currentScaleValue = normalizedReference.slice(prefix.length);
  const scale = getTokenScale(defaults, scalePath);
  const currentIndex = scale.indexOf(currentScaleValue);

  if (currentIndex === -1) {
    return reference;
  }

  const targetIndex = Math.min(Math.max(currentIndex + offset, 0), scale.length - 1);

  return `{${prefix}${scale[targetIndex]}}`;
};

const getScaleReferenceAtIndex = (
  defaults: unknown,
  scalePath: string,
  targetIndex: number,
  fallbackReference: string,
) => {
  const scale = getTokenScale(defaults, scalePath);

  if (scale.length === 0) {
    return fallbackReference;
  }

  const clampedIndex = Math.min(Math.max(targetIndex, 0), scale.length - 1);

  return `{${scalePath}.${scale[clampedIndex]}}`;
};

const getScaleReferenceForKey = (
  defaults: unknown,
  scalePath: string,
  targetKey: string,
  fallbackReference: string,
) => {
  const scale = getTokenScale(defaults, scalePath);

  if (!scale.includes(targetKey)) {
    return fallbackReference;
  }

  return `{${scalePath}.${targetKey}}`;
};

/**
 * Builds a nested token object with a single `$value` leaf.
 *
 * Example input:
 * `path = 'nl.paragraph.lead.font-size'`
 * `value = '{basis.text.font-size.xl}'`
 *
 * Example return:
 * `{ nl: { paragraph: { lead: { 'font-size': { $value: '{basis.text.font-size.xl}' } } } } }`
 */
const buildTokenValue = (path: string, value: unknown) => {
  return path.split('.').reduceRight<Record<string, unknown>>((acc, key) => ({ [key]: acc }), { $value: value });
};

/**
 * Resolves one dynamic preset option into a concrete option with actual token values and preview style.
 *
 * Example input:
 * `option = { name: 'Extra ruim', derivedTokenReference: { offset: 1, scalePath: 'basis.text.font-size', sourcePath: 'nl.paragraph.font-size', targetPath: 'nl.paragraph.lead.font-size' }, tokens: {} }`
 *
 * Example return:
 * `{ name: 'Extra ruim', derivedTokenReference: { ... }, previewStyle: '--nl-paragraph-lead-font-size:var(--basis-text-font-size-xl)', tokens: { nl: { paragraph: { lead: { 'font-size': { $value: '{basis.text.font-size.xl}' } } } } } }`
 */
const resolveDynamicPresetOption = <TOption extends DynamicPresetOption>(
  option: TOption,
  defaults: unknown,
  selectedOptions: SelectedPresetOption[],
): TOption => {
  if (!option.derivedTokenReference) {
    return option;
  }

  const { offset, scalePath, sourcePath, targetIndex, targetKey, targetPath } = option.derivedTokenReference;
  const sourceReference = getSelectedTokenReference(selectedOptions, sourcePath, defaults, `{${scalePath}.md}`);
  let resolvedValue: string;

  if (typeof targetKey === 'string') {
    resolvedValue = getScaleReferenceForKey(defaults, scalePath, targetKey, sourceReference);
  } else if (typeof targetIndex === 'number') {
    resolvedValue = getScaleReferenceAtIndex(defaults, scalePath, targetIndex, sourceReference);
  } else {
    resolvedValue = getShiftedScaleReference(defaults, sourceReference, scalePath, offset);
  }

  const resolvedTokens = buildTokenValue(targetPath, resolvedValue);

  return {
    ...option,
    previewStyle: styleObjectToString(presetTokensToStyle(resolvedTokens)),
    tokens: resolvedTokens,
  };
};

/**
 * Resolves all dynamic preset options in a preset group.
 *
 * Example input:
 * `{ defaults, options: [{ name: 'Aanbevolen', derivedTokenReference: { ... }, tokens: {} }], selectedOptions }`
 *
 * Example return:
 * `[{ name: 'Aanbevolen', derivedTokenReference: { ... }, previewStyle: '--nl-paragraph-lead-font-size:var(--basis-text-font-size-lg)', tokens: { nl: { paragraph: { lead: { 'font-size': { $value: '{basis.text.font-size.lg}' } } } } } }]`
 */
export const resolveDynamicPresetOptions = <TOption extends DynamicPresetOption>({
  defaults,
  options,
  selectedOptions,
}: PresetResolutionContext<TOption>) =>
  options.map((option) => resolveDynamicPresetOption(option, defaults, selectedOptions));
