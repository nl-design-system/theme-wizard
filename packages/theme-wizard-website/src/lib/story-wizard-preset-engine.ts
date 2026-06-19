import { styleObjectToString, tokensToStyle } from '@app/lib/Theme/lib';
import { resolveDynamicPresetOptions } from './story-wizard-preset-resolution';
import {
  type DynamicPresetOption,
  type SelectedPresetOption,
  type StoryWizardPresetGroup,
  type StoryWizardPresetObject,
  type StoryWizardPresetOption,
  type StoryWizardPresetOptionObject,
} from './types';

const hasDerivedPresetReferences = (option: DynamicPresetOption) =>
  Boolean(
    option.derivedTokenReference ||
    (Array.isArray(option.derivedTokenReferences) && option.derivedTokenReferences.length > 0),
  );

const createPresetPreviewStyle = (tokens: unknown) =>
  styleObjectToString(tokensToStyle(tokens as never) as Record<string, string>);

export const createStoryWizardPresetOption = (option: StoryWizardPresetOptionObject): StoryWizardPresetOption => ({
  name: option.name,
  derivedTokenReference: option.derivedTokenReference,
  derivedTokenReferences: option.derivedTokenReferences,
  description: option.description,
  previewStyle: createPresetPreviewStyle(option.tokens),
  tokens: option.tokens,
});

export const createStoryWizardPresetGroup = ({
  id,
  preset,
}: {
  id: string;
  preset: StoryWizardPresetObject;
}): StoryWizardPresetGroup => ({
  id,
  name: preset.question ?? preset.name,
  description: preset.description,
  options: preset.options.map(createStoryWizardPresetOption),
  type: 'preset',
});

export const createStoryWizardPresetGroups = ({
  idPrefix,
  presets,
}: {
  idPrefix: string;
  presets: StoryWizardPresetObject[];
}) =>
  presets.map((preset, index) =>
    createStoryWizardPresetGroup({
      id: `${idPrefix}-preset-group-${index}`,
      preset,
    }),
  );

export const resolveStoryWizardPresetGroup = ({
  defaults,
  group,
  selectedOptions,
}: {
  defaults: unknown;
  group: StoryWizardPresetGroup;
  selectedOptions: SelectedPresetOption[];
}): StoryWizardPresetGroup => ({
  ...group,
  options: group.options.some(hasDerivedPresetReferences)
    ? resolveDynamicPresetOptions({ defaults, options: group.options, selectedOptions })
    : group.options,
});

export const resolveStoryWizardPresetGroups = ({
  defaults,
  groups,
  selectedOptions = [],
}: {
  defaults: unknown;
  groups: StoryWizardPresetGroup[];
  selectedOptions?: SelectedPresetOption[];
}) => groups.map((group) => resolveStoryWizardPresetGroup({ defaults, group, selectedOptions }));
