import { styleObjectToString, tokensToStyle } from '../../../theme-wizard-app/src/lib/Theme/lib';
import { getStories } from '../../../theme-wizard-app/src/utils/csf-utils';
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
    const rawSteps = wizardStories
      .map(([id, story]: StoryEntry) => this.createStep(id, story, allStories, presetTokenPaths))
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
      const groupKey = step.flowGroup;

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

        const flowTitle = chunk[0].flowTitle;

        return {
          id: chunk.map((step) => step.id).join('--'),
          flowGroup: groupKey,
          flowTitle,
          groups: chunk.flatMap((step) => step.groups),
          intro: `Gebruik deze stap om meerdere geavanceerde instellingen binnen ${flowTitle.toLowerCase()} verder te verfijnen.`,
          order: chunk[0].order,
          previewStories: Array.from(
            new Map(chunk.flatMap((step) => step.previewStories).map((s) => [s.id, s])).values(),
          ),
          title: flowTitle,
        };
      })
      .filter((step): step is StoryWizardStep => Boolean(step));
  }

  private static createStep(
    id: string,
    story: StoryWizardStory,
    allStories: StoryEntry[],
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

    const wizard = story.parameters!.wizard!;

    return {
      id,
      flowGroup: wizard.type === 'advanced' ? wizard.stepTitle : id,
      flowTitle: wizard.type === 'advanced' ? wizard.stepTitle : (story.name ?? id),
      groups,
      intro: wizard.description,
      order: wizard.order,
      previewStories: this.resolveStepPreviewStories(id, story, allStories),
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

    const wizard = story.parameters!.wizard!;
    if (wizard.type !== 'advanced') return null;

    const storyName = story.name ?? storyId;
    const name =
      wizard.question ?? (storyName.startsWith('Design: ') ? storyName.slice('Design: '.length) : storyName);

    return {
      id: `${storyId}-editable-tokens`,
      name,
      advancedTitle: wizard.advancedTitle ?? 'Geavanceerde instellingen',
      description: wizard.description,
      tokens: filteredTokens,
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
  ): StoryWizardPreview[] {
    const wizard = story.parameters!.wizard!;

    if (wizard.type === 'advanced') {
      return [this.toPreviewStory(id, story)];
    }

    return wizard.previewStoryIds
      .map((previewStoryId) => allStories.find(([storyId]) => storyId === previewStoryId))
      .filter((entry): entry is StoryEntry => Boolean(entry))
      .map(([previewStoryId, previewStory]) => this.toPreviewStory(previewStoryId, previewStory));
  }

  private static toPreviewStory(id: string, story: StoryWizardStory): StoryWizardPreview {
    return {
      id,
      name: story.name ?? id,
    };
  }
}
