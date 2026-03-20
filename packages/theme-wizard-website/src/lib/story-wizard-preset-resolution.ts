import dlv from 'dlv';

export type DerivedTokenReference = {
  offset: number;
  scalePath: string;
  sourcePath: string;
  targetPath: string;
};

export type DynamicPresetOption = {
  derivedTokenReference?: DerivedTokenReference;
  tokens: unknown;
};

type SelectedPresetOption = {
  tokens: unknown;
} | null;

type PresetResolutionContext<TOption extends DynamicPresetOption> = {
  defaults: unknown;
  options: TOption[];
  selectedOptions: SelectedPresetOption[];
};

const getTokenScale = (defaults: unknown, path: string) => {
  const tokenGroup = dlv(defaults && typeof defaults === 'object' ? defaults : undefined, path);

  if (!tokenGroup || typeof tokenGroup !== 'object' || Array.isArray(tokenGroup)) {
    return [];
  }

  return Object.keys(tokenGroup);
};

const getTokenValueAtPath = (tokens: unknown, path: string) => {
  const token = dlv(tokens && typeof tokens === 'object' ? tokens : undefined, path);

  return token && typeof token === 'object' && '$value' in (token as Record<string, unknown>)
    ? (token as { $value?: unknown }).$value
    : undefined;
};

const getSelectedTokenReference = (
  selectedOptions: SelectedPresetOption[],
  path: string,
  fallbackReference: string,
) => {
  for (const option of selectedOptions) {
    const value = getTokenValueAtPath(option?.tokens, path);

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      return value;
    }
  }

  return fallbackReference;
};

const getShiftedScaleReference = (defaults: unknown, reference: string, scalePath: string, offset: number) => {
  const normalizedReference =
    reference.startsWith('{') && reference.endsWith('}') ? reference.slice(1, -1) : reference;
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

const buildTokenValue = (path: string, value: unknown) => {
  const result: Record<string, unknown> = {};
  const segments = path.split('.');
  let current: Record<string, unknown> = result;

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      current[segment] = { $value: value };
      return;
    }

    current[segment] = {};
    current = current[segment] as Record<string, unknown>;
  });

  return result;
};

const resolveDynamicPresetOption = <TOption extends DynamicPresetOption>(
  option: TOption,
  defaults: unknown,
  selectedOptions: SelectedPresetOption[],
): TOption => {
  if (!option.derivedTokenReference) {
    return option;
  }

  const { offset, scalePath, sourcePath, targetPath } = option.derivedTokenReference;
  const sourceReference = getSelectedTokenReference(selectedOptions, sourcePath, `{${scalePath}.md}`);
  const resolvedValue = getShiftedScaleReference(defaults, sourceReference, scalePath, offset);

  return {
    ...option,
    tokens: buildTokenValue(targetPath, resolvedValue),
  };
};

export const resolveDynamicPresetOptions = <TOption extends DynamicPresetOption>({
  defaults,
  options,
  selectedOptions,
}: PresetResolutionContext<TOption>) =>
  options.map((option) => resolveDynamicPresetOption(option, defaults, selectedOptions));
