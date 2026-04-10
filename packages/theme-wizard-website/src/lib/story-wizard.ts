import { styleObjectToString, tokensToStyle } from '@app/lib/Theme/lib';
import { getStories } from '@app/utils/csf-utils';
import { components } from './components';
import {
  type StoryWizardPresetGroup,
  type StoryWizardEditableToken,
  type StoryWizardEditableTokenGroup,
  type StoryWizardPreview,
  type StoryWizardStep,
  type StoryWizardPresetObject,
  type StoryWizardViewModel,
  type StoryWizardStory,
  type StoryEntry,
} from './types';

const formatLabelPart = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatTokenLabel = (tokenPath: string) => {
  const parts = tokenPath.split('.');
  const relevantParts = parts.slice(2);

  if (relevantParts.length === 0) {
    return tokenPath;
  }

  if (relevantParts.length === 1) {
    return formatLabelPart(relevantParts[0]);
  }

  return relevantParts.map(formatLabelPart).join(' ');
};

const formatTokenCssVar = (tokenPath: string) => `--${tokenPath.replaceAll('.', '-')}`;

const collectEditableTokenPaths = (tokens: unknown, path: string[] = []): StoryWizardEditableToken[] => {
  if (!tokens || typeof tokens !== 'object') return [];

  if ('$value' in (tokens as Record<string, unknown>)) {
    const tokenPath = path.join('.');
    return [{ cssVar: formatTokenCssVar(tokenPath), label: formatTokenLabel(tokenPath), path: tokenPath }];
  }

  return Object.entries(tokens as Record<string, unknown>).flatMap(([key, value]) =>
    collectEditableTokenPaths(value, [...path, key]),
  );
};

export const resolveStoryWizardModel = async (componentId: keyof typeof components): Promise<StoryWizardViewModel> => {
  const componentModule = await components[componentId].stories();
  const { default: meta, ...storyExports } = componentModule;

  const allStories = getStories(storyExports as unknown as Record<PropertyKey, StoryWizardStory>, meta) as StoryEntry[];

  const wizardStories = allStories.filter(([, story]) => isWizardStory(story));

  const storyMap = new Map(allStories);

  const rawSteps = wizardStories
    .reduce<StoryWizardStep[]>((acc, [id, story]) => {
      const step = createStep(id, story, storyMap);
      if (step) acc.push(step);
      else console.warn('No valid configuration for wizard step found.', story);
      return acc;
    }, [])
    .sort((a, b) => a.order - b.order);

  const steps = rawSteps;
  const storyIds = Array.from(
    new Set(steps.flatMap((step) => [step.id, ...step.previewStories.map((p) => p.id), ...step.cardPreviewStories.map((p) => p.id)])),
  );

  return {
    componentId,
    steps,
    storyIds,
  };
};


const createStep = (
  id: string,
  story: StoryWizardStory,
  storyMap: Map<string, StoryWizardStory>,
): StoryWizardStep | null => {
  const wizard = story.parameters!.wizard!;
  let groups: Array<StoryWizardPresetGroup | StoryWizardEditableTokenGroup> = [];

  if (wizard.type === 'preset' && story.parameters!.presets?.length) {
    groups = story.parameters!.presets.map((preset, index) => createPresetGroup(id, preset, index));
  } else if (wizard.type === 'advanced' && story.parameters!.editableTokens) {
    const group = createEditableTokenGroup(id, story);
    if (group) groups.push(group);
  }

  if (groups.length === 0) {
    return null;
  }

  return {
    cardPreviewStories: resolveCardPreviewStories(id, story, storyMap),
    id,
    flowGroup: wizard.type === 'preset' && wizard.flowGroup ? wizard.flowGroup : id,
    flowTitle: wizard.type === 'preset' && wizard.flowTitle ? wizard.flowTitle : (story.name ?? id),
    groups,
    intro: wizard.description,
    order: wizard.order,
    previewStories: resolveStepPreviewStories(id, story, storyMap),
    title: story.name ?? id,
    type: wizard.type,
  };
};

const createPresetGroup = (storyId: string, preset: StoryWizardPresetObject, index: number): StoryWizardPresetGroup => {
  return {
    id: `${storyId}-preset-group-${index}`,
    name: preset.question ?? preset.name,
    description: preset.description,
    options: preset.options.map((option) => ({
      name: option.name,
      derivedTokenReference: option.derivedTokenReference,
      derivedTokenReferences: option.derivedTokenReferences,
      description: option.description,
      previewStyle: styleObjectToString(tokensToStyle(option.tokens as never) as Record<string, string>),
      tokens: option.tokens,
    })),
    type: 'preset',
  };
};

const createEditableTokenGroup = (storyId: string, story: StoryWizardStory): StoryWizardEditableTokenGroup | null => {
  const editableTokens = collectEditableTokenPaths(story.parameters?.editableTokens);

  if (editableTokens.length === 0) {
    return null;
  }

  const wizard = story.parameters!.wizard!;
  if (wizard.type !== 'advanced') return null;

  const storyName = story.name ?? storyId;
  const name = wizard.question ?? (storyName.startsWith('Design: ') ? storyName.slice('Design: '.length) : storyName);

  return {
    id: `${storyId}-editable-tokens`,
    name,
    advancedTitle: wizard.advancedTitle ?? 'Geavanceerde instellingen',
    description: wizard.description,
    tokens: editableTokens,
    type: 'editable-tokens',
  };
};

const isWizardStory = (story: StoryWizardStory) => {
  return Boolean(
    (story.parameters?.wizard?.type === 'preset' && story.parameters?.presets?.length) ||
    (story.parameters?.wizard?.type === 'advanced' && story.parameters?.editableTokens),
  );
};

const resolveStepPreviewStories = (
  id: string,
  story: StoryWizardStory,
  storyMap: Map<string, StoryWizardStory>,
): StoryWizardPreview[] => {
  const wizard = story.parameters!.wizard!;

  const previewStoryIds = wizard.type === 'advanced' ? (wizard.previewStoryIds ?? []) : wizard.previewStoryIds;

  if (previewStoryIds.length > 0) {
    return previewStoryIds.flatMap((previewStoryId) => {
      const previewStory = storyMap.get(previewStoryId);
      return previewStory ? [toPreviewStory(previewStoryId, previewStory)] : [];
    });
  }

  return [toPreviewStory(id, story)];
};

const resolveCardPreviewStories = (
  id: string,
  story: StoryWizardStory,
  storyMap: Map<string, StoryWizardStory>,
): StoryWizardPreview[] => {
  const wizard = story.parameters!.wizard!;
  const cardPreviewStoryIds = wizard.cardPreviewStoryIds ?? [];

  if (cardPreviewStoryIds.length > 0) {
    return cardPreviewStoryIds.flatMap((previewStoryId) => {
      const previewStory = storyMap.get(previewStoryId);
      return previewStory ? [toPreviewStory(previewStoryId, previewStory)] : [];
    });
  }

  return resolveStepPreviewStories(id, story, storyMap);
};

const toPreviewStory = (id: string, story: StoryWizardStory): StoryWizardPreview => {
  return {
    id,
    name: story.name ?? id,
  };
};
