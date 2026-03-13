import { components } from '@/lib/components';
import { tokensToStyle } from '../../../theme-wizard-app/src/lib/Theme/lib';
import { getStories } from '../../../theme-wizard-app/src/utils/csf-utils';

export type StoryWizardPresetOption = {
  description?: string;
  name: string;
  previewStyle: string;
  tokens: unknown;
};

export type StoryWizardPresetGroup = {
  description?: string;
  id: string;
  name: string;
  options: StoryWizardPresetOption[];
  showThumbnail: boolean;
};

export type StoryWizardPreview = {
  id: string;
  name: string;
};

export type StoryWizardStep = {
  id: string;
  intro: string;
  previewStories: StoryWizardPreview[];
  groups: StoryWizardPresetGroup[];
  title: string;
};

export type StoryWizardViewModel = {
  componentId: keyof typeof components;
  storyIds: string[];
  steps: StoryWizardStep[];
};

type StoryWizardPresetOptionObject = {
  description?: string;
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
  presets?: StoryWizardPresetObject[];
  wizard?: {
    preview?: boolean;
    previewStoryIds?: string[];
  };
  [key: PropertyKey]: unknown;
};

type StoryWizardStory = {
  name?: string;
  parameters?: StoryWizardParameters;
  [key: PropertyKey]: unknown;
};

type StoryEntry = [id: string, story: StoryWizardStory];

const DEFAULT_STEP_INTRO = 'Kies een preset om direct te zien hoe dit component zich in de wizard gedraagt.';

const styleObjectToString = (styleObject: Record<string, string>) =>
  Object.entries(styleObject)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');

export class StoryWizardModel {
  public static async fromComponentId(componentId: keyof typeof components): Promise<StoryWizardViewModel> {
    const componentModule = await components[componentId].stories();
    const { default: meta, ...storyExports } = componentModule;
    const allStories = getStories(
      storyExports as unknown as Record<PropertyKey, StoryWizardStory>,
      meta,
    ) as StoryEntry[];
    const presetStories = allStories.filter(([, story]: StoryEntry) => story.parameters?.presets?.length);
    const previewStories = this.resolvePreviewStories(allStories, presetStories);
    const steps = presetStories.map(([id, story]: StoryEntry) => this.createStep(id, story, previewStories));
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

  private static createStep(
    id: string,
    story: StoryWizardStory,
    previewStories: StoryWizardPreview[],
  ): StoryWizardStep {
    return {
      id,
      groups: (story.parameters?.presets ?? []).map((preset, index) => this.createGroup(id, preset, index)),
      intro: DEFAULT_STEP_INTRO,
      previewStories: this.resolveStepPreviewStories(story, previewStories),
      title: story.name ?? id,
    };
  }

  private static createGroup(storyId: string, preset: StoryWizardPresetObject, index: number): StoryWizardPresetGroup {
    return {
      id: `${storyId}-preset-group-${index}`,
      name: preset.question ?? preset.name,
      description: preset.description,
      options: preset.options.map((option) => ({
        name: option.name,
        description: option.description,
        previewStyle: styleObjectToString(tokensToStyle(option.tokens as never) as Record<string, string>),
        tokens: option.tokens,
      })),
      showThumbnail: preset.thumbnail !== false,
    };
  }

  private static resolvePreviewStories(allStories: StoryEntry[], presetStories: StoryEntry[]): StoryWizardPreview[] {
    const explicitPreviewStories = allStories.filter(([, story]) => story.parameters?.wizard?.preview);
    if (explicitPreviewStories.length > 0) {
      return explicitPreviewStories.map(([id, story]) => this.toPreviewStory(id, story));
    }

    const wizardPreviewStory = allStories.find(([, story]) => story.name === 'Wizard Preview');
    if (wizardPreviewStory) {
      return [this.toPreviewStory(...wizardPreviewStory)];
    }

    const fallbackStory = presetStories[0];
    return fallbackStory ? [this.toPreviewStory(...fallbackStory)] : [];
  }

  private static resolveStepPreviewStories(
    story: StoryWizardStory,
    previewStories: StoryWizardPreview[],
  ): StoryWizardPreview[] {
    const previewStoryIds = story.parameters?.wizard?.previewStoryIds;
    if (!previewStoryIds?.length) {
      return previewStories;
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
