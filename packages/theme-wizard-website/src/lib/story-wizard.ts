import type { DerivedTokenReference } from './story-wizard-preset-resolution';
import { styleObjectToString, tokensToStyle } from '../../../theme-wizard-app/src/lib/Theme/lib';
import { getStories } from '../../../theme-wizard-app/src/utils/csf-utils';
import { components } from './components';

export type StoryWizardPresetOption = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
  name: string;
  previewStyle: string;
  tokens: unknown;
};

export type StoryWizardPresetGroup = {
  type: 'preset';
  description?: string;
  id: string;
  name: string;
  options: StoryWizardPresetOption[];
};

export type StoryWizardEditableToken = {
  cssVar: string;
  label: string;
  path: string;
};

export type StoryWizardEditableTokenGroup = {
  advancedTitle?: string;
  type: 'editable-tokens';
  description?: string;
  id: string;
  name: string;
  tokens: StoryWizardEditableToken[];
};

export type StoryWizardPreview = {
  id: string;
  name: string;
};

export type StoryWizardStep = {
  flowGroup: string;
  flowTitle?: string;
  id: string;
  intro?: string;
  order: number;
  previewStories: StoryWizardPreview[];
  groups: Array<StoryWizardPresetGroup | StoryWizardEditableTokenGroup>;
  title: string;
};

export type StoryWizardViewModel = {
  componentId: keyof typeof components;
  storyIds: string[];
  steps: StoryWizardStep[];
};

type StoryWizardPresetOptionObject = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
  name: string;
  tokens: unknown;
};

type StoryWizardPresetObject = {
  description?: string;
  name: string;
  options: StoryWizardPresetOptionObject[];
  question?: string;
  thumbnail?: boolean;
};

type StoryWizardParameters = {
  editableTokens?: unknown;
  presets?: StoryWizardPresetObject[];
  wizard?: {
    advancedTitle?: string;
    description?: string;
    order: number;
    preview?: boolean;
    previewStoryIds?: string[];
    question?: string;
    step: string;
    stepTitle?: string;
    type?: 'advanced' | 'preset';
  };
  [key: PropertyKey]: unknown;
};

type StoryWizardStory = {
  name?: string;
  parameters?: StoryWizardParameters;
  [key: PropertyKey]: unknown;
};

type StoryEntry = [id: string, story: StoryWizardStory];

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

const uniqueById = <T extends { id: string }>(items: T[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

const summarizeTitles = (titles: string[]) => {
  const uniqueTitles = Array.from(new Set(titles.filter(Boolean)));

  if (uniqueTitles.length <= 1) {
    return uniqueTitles[0] ?? 'Stap';
  }

  if (uniqueTitles.length === 2) {
    return `${uniqueTitles[0]} · ${uniqueTitles[1]}`;
  }

  return `${uniqueTitles[0]} · ${uniqueTitles[1]} +${uniqueTitles.length - 2}`;
};

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

const tokenPropertyOrder = [
  'background-color',
  'border-color',
  'color',
  'border-width',
  'border-radius',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
];
const tokenStateOrder = ['default', 'hover', 'active', 'pressed', 'disabled', 'focus'];

const getTokenPropertyRank = (tokenPath: string) => {
  const parts = tokenPath.split('.');
  const property = parts[parts.length - 1] ?? '';
  const rank = tokenPropertyOrder.indexOf(property);
  return rank === -1 ? tokenPropertyOrder.length : rank;
};

const getTokenStateRank = (tokenPath: string) => {
  const parts = tokenPath.split('.');
  const stateIndex = parts.findIndex((part) => tokenStateOrder.includes(part));

  if (stateIndex === -1) {
    return tokenStateOrder.indexOf('default');
  }

  return tokenStateOrder.indexOf(parts[stateIndex]);
};

const compareEditableTokens = (left: StoryWizardEditableToken, right: StoryWizardEditableToken) => {
  const leftPath = left.path;
  const rightPath = right.path;
  const stateRankDifference = getTokenStateRank(leftPath) - getTokenStateRank(rightPath);

  if (stateRankDifference !== 0) {
    return stateRankDifference;
  }

  const propertyRankDifference = getTokenPropertyRank(leftPath) - getTokenPropertyRank(rightPath);

  if (propertyRankDifference !== 0) {
    return propertyRankDifference;
  }

  return leftPath.localeCompare(rightPath);
};


export class StoryWizardModel {
  public static async fromComponentId(componentId: keyof typeof components): Promise<StoryWizardViewModel> {
    const componentModule = await components[componentId].stories();
    const { default: meta, ...storyExports } = componentModule;
    const allStories = getStories(
      storyExports as unknown as Record<PropertyKey, StoryWizardStory>,
      meta,
    ) as StoryEntry[];
    const wizardStories = allStories.filter(([, story]: StoryEntry) => this.isWizardStory(story));
    const presetTokenPaths = this.collectPresetTokenPaths(wizardStories);
    const previewStories = this.resolvePreviewStories(allStories, wizardStories);
    const rawSteps = wizardStories
      .map(([id, story]: StoryEntry) => this.createStep(id, story, allStories, previewStories, presetTokenPaths))
      .filter((step): step is StoryWizardStep => step !== null)
      .sort((a, b) => a.order - b.order);
    const steps = this.createFlowSteps(rawSteps);
    const storyIds = Array.from(
      new Set([
        ...steps.flatMap((step: StoryWizardStep) =>
          step.previewStories.map((previewStory: StoryWizardPreview) => previewStory.id),
        ),
        ...steps.map((step: StoryWizardStep) => step.id),
      ]),
    );

    return {
      componentId,
      steps,
      storyIds,
    };
  }

  private static createFlowSteps(rawSteps: StoryWizardStep[]) {
    const safeSteps = rawSteps.filter((step) => !this.isAdvancedStep(step));
    const advancedSteps = rawSteps.filter((step) => this.isAdvancedStep(step));

    return [...safeSteps, ...this.mergeStepsByFlowGroup(advancedSteps)];
  }

  private static mergeStepsByFlowGroup(steps: StoryWizardStep[]) {
    if (steps.length === 0) {
      return [];
    }

    const groupedSteps = new Map<string, StoryWizardStep[]>();
    const groupOrder: string[] = [];

    steps.forEach((step) => {
      const groupKey = step.flowGroup ?? step.id;

      if (!groupedSteps.has(groupKey)) {
        groupedSteps.set(groupKey, []);
        groupOrder.push(groupKey);
      }

      groupedSteps.get(groupKey)?.push(step);
    });

    return groupOrder
      .map((groupKey) => {
        const chunk = groupedSteps.get(groupKey) ?? [];

        if (chunk.length <= 1) {
          return chunk[0];
        }

        return {
          id: chunk.map((step) => step.id).join('--'),
          flowGroup: groupKey,
          flowTitle: chunk[0].flowTitle,
          groups: chunk.flatMap((step) => step.groups),
          intro: `Gebruik deze stap om meerdere geavanceerde instellingen binnen ${(
            chunk[0].flowTitle ?? summarizeTitles(chunk.map((step) => step.title))
          ).toLowerCase()} verder te verfijnen.`,
          order: chunk[0].order,
          previewStories: uniqueById(chunk.flatMap((step) => step.previewStories)),
          title: chunk[0].flowTitle ?? summarizeTitles(chunk.map((step) => step.title)),
        };
      })
      .filter((step): step is StoryWizardStep => Boolean(step));
  }

  private static createStep(
    id: string,
    story: StoryWizardStory,
    allStories: StoryEntry[],
    previewStories: StoryWizardPreview[],
    presetTokenPaths: Set<string>,
  ): StoryWizardStep | null {
    const groups = story.parameters?.presets?.length
      ? story.parameters?.wizard?.type === 'preset'
        ? (story.parameters.presets ?? []).map((preset, index) => this.createPresetGroup(id, preset, index))
        : []
      : story.parameters?.wizard?.type === 'advanced' && story.parameters?.editableTokens
        ? [this.createEditableTokenGroup(id, story, presetTokenPaths)].filter(
            (group): group is StoryWizardEditableTokenGroup => group !== null,
          )
        : [];

    if (groups.length === 0) {
      return null;
    }

    return {
      id,
      flowGroup: story.parameters!.wizard!.step,
      flowTitle: story.parameters?.wizard?.stepTitle,
      groups,
      intro: story.parameters?.wizard?.description,
      order: story.parameters!.wizard!.order,
      previewStories: this.resolveStepPreviewStories(id, story, allStories, previewStories),
      title: story.name ?? id,
    };
  }

  private static createPresetGroup(
    storyId: string,
    preset: StoryWizardPresetObject,
    index: number,
  ): StoryWizardPresetGroup {
    return {
      id: `${storyId}-preset-group-${index}`,
      name: preset.question ?? preset.name,
      description: preset.description,
      options: preset.options.map((option) => ({
        name: option.name,
        derivedTokenReference: option.derivedTokenReference,
        description: option.description,
        previewStyle: styleObjectToString(tokensToStyle(option.tokens as never) as Record<string, string>),
        tokens: option.tokens,
      })),
      type: 'preset',
    };
  }

  private static createEditableTokenGroup(
    storyId: string,
    story: StoryWizardStory,
    presetTokenPaths: Set<string>,
  ): StoryWizardEditableTokenGroup | null {
    const editableTokens = collectEditableTokenPaths(story.parameters?.editableTokens);
    const filteredTokens = editableTokens.filter((token) => !presetTokenPaths.has(token.path));
    if (filteredTokens.length === 0) {
      return null;
    }

    const storyName = story.name ?? storyId;
    const name =
      story.parameters?.wizard?.question ??
      (storyName.startsWith('Design: ') ? storyName.slice('Design: '.length) : storyName);

    return {
      id: `${storyId}-editable-tokens`,
      name,
      advancedTitle: story.parameters?.wizard?.advancedTitle ?? 'Geavanceerde instellingen',
      description: story.parameters?.wizard?.description,
      tokens: [...filteredTokens].sort(compareEditableTokens),
      type: 'editable-tokens',
    };
  }

  private static collectPresetTokenPaths(stories: StoryEntry[]) {
    return new Set(
      stories.flatMap(([, story]) =>
        (story.parameters?.presets ?? []).flatMap((preset) =>
          preset.options.flatMap((option) => collectEditableTokenPaths(option.tokens).map((token) => token.path)),
        ),
      ),
    );
  }

  private static resolvePreviewStories(allStories: StoryEntry[], wizardStories: StoryEntry[]): StoryWizardPreview[] {
    const explicitPreviewStories = allStories.filter(([, story]) => story.parameters?.wizard?.preview);
    if (explicitPreviewStories.length > 0) {
      return explicitPreviewStories.map(([id, story]) => this.toPreviewStory(id, story));
    }

    const wizardPreviewStory = allStories.find(([, story]) => story.name === 'Wizard Preview');
    if (wizardPreviewStory) {
      return [this.toPreviewStory(...wizardPreviewStory)];
    }

    const fallbackStory = wizardStories[0];
    return fallbackStory ? [this.toPreviewStory(...fallbackStory)] : [];
  }

  private static isWizardStory(story: StoryWizardStory) {
    return Boolean(
      (story.parameters?.wizard?.type === 'preset' && story.parameters?.presets?.length) ||
        (story.parameters?.wizard?.type === 'advanced' && story.parameters?.editableTokens),
    );
  }

  private static isAdvancedStep(step: StoryWizardStep) {
    return step.groups.some((group) => group.type === 'editable-tokens');
  }

  private static resolveStepPreviewStories(
    id: string,
    story: StoryWizardStory,
    allStories: StoryEntry[],
    previewStories: StoryWizardPreview[],
  ): StoryWizardPreview[] {
    const previewStoryIds = story.parameters?.wizard?.previewStoryIds;
    if (!previewStoryIds?.length) {
      if (story.parameters?.wizard?.type === 'advanced') {
        return [this.toPreviewStory(id, story)];
      }

      return previewStories;
    }

    const explicitlyResolvedPreviewStories = previewStoryIds
      .map((previewStoryId) => allStories.find(([id]) => id === previewStoryId))
      .filter((entry): entry is StoryEntry => Boolean(entry))
      .map(([previewStoryId, previewStory]) => this.toPreviewStory(previewStoryId, previewStory));

    if (explicitlyResolvedPreviewStories.length > 0) {
      return explicitlyResolvedPreviewStories;
    }

    const filteredPreviewStories = previewStories.filter((previewStory) => previewStoryIds.includes(previewStory.id));
    return filteredPreviewStories.length > 0 ? filteredPreviewStories : previewStories;
  }

  private static toPreviewStory(id: string, story: StoryWizardStory): StoryWizardPreview {
    return {
      id,
      name: story.name ?? id,
    };
  }
}
