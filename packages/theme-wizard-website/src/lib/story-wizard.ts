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

  const presetTokenPaths = collectPresetTokenPaths(wizardStories);
  const storyMap = new Map(allStories);

  const rawSteps = wizardStories
    .reduce<StoryWizardStep[]>((acc, [id, story]) => {
      const step = createStep(id, story, storyMap, presetTokenPaths);
      if (step) acc.push(step);
      else console.warn('No valid configuration for wizard step found.', story);
      return acc;
    }, [])
    .sort((a, b) => a.order - b.order);

  const steps = createFlowSteps(rawSteps);
  const storyIds = Array.from(new Set(steps.flatMap((step) => [step.id, ...step.previewStories.map((p) => p.id)])));

  return {
    componentId,
    steps,
    storyIds,
  };
};

const createFlowSteps = (rawSteps: StoryWizardStep[]) => {
  const safeSteps = rawSteps.filter((step) => step.type !== 'advanced');
  const advancedSteps = rawSteps.filter((step) => step.type === 'advanced');

  return [...safeSteps, ...mergeStepsByFlowGroup(advancedSteps)];
};

/**
 * Groups and merges individual 'advanced' story-wizard steps based on their shared `flowGroup` (determined by `wizard.stepTitle`).
 * This process allows developers to author small, isolated stories per component/variant,
 * while rendering them together as one logical bundle within the Wizard UI.
 */
const mergeStepsByFlowGroup = (steps: StoryWizardStep[]) => {
  if (steps.length === 0) {
    return [];
  }

  // 1. Group all steps in a temporary Map.
  // We explicitly keep track of the original insertion order (`groupOrder`),
  // to ensure numbered flow steps don't arbitrarily shuffle during the iteration.
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

  // 2. Iterate through our unique ordered keys and build the final array of merged steps
  return groupOrder
    .map((groupKey) => {
      const chunk = groupedSteps.get(groupKey) ?? [];

      // If there's only 1 advanced story in this group, no merging is required.
      if (chunk.length <= 1) {
        return chunk[0];
      }

      const flowTitle = chunk[0].flowTitle;

      // 3. Merge all isolated stories together into a single 'Super-Step'
      return {
        // ID is a unique concatenation of all merged stories (e.g. 'button-primary--button-secondary')
        id: chunk.map((step) => step.id).join('--'),
        flowGroup: groupKey,
        flowTitle,
        groups: chunk.flatMap((step) => step.groups),
        intro: `Gebruik deze stap om meerdere geavanceerde instellingen binnen ${flowTitle.toLowerCase()} verder te verfijnen.`,
        // Stack all their individual groups (like editable token lists) and panels on top of one another
        // Roughly preserve the original sort order (based on the first element found)
        order: chunk[0].order,
        // Live previews: Remove duplicates (via Map) so we don't load the same story twice in the preview UI
        previewStories: Array.from(
          new Map(chunk.flatMap((step) => step.previewStories).map((s) => [s.id, s])).values(),
        ),
        title: flowTitle,
        type: 'advanced',
      };
    })
    .filter((step): step is StoryWizardStep => Boolean(step));
};

const createStep = (
  id: string,
  story: StoryWizardStory,
  storyMap: Map<string, StoryWizardStory>,
  presetTokenPaths: Set<string>,
): StoryWizardStep | null => {
  const wizard = story.parameters!.wizard!;
  let groups: Array<StoryWizardPresetGroup | StoryWizardEditableTokenGroup> = [];

  if (wizard.type === 'preset' && story.parameters!.presets?.length) {
    groups = story.parameters!.presets.map((preset, index) => createPresetGroup(id, preset, index));
  } else if (wizard.type === 'advanced' && story.parameters!.editableTokens) {
    const group = createEditableTokenGroup(id, story, presetTokenPaths);
    if (group) groups.push(group);
  }

  if (groups.length === 0) {
    return null;
  }

  return {
    id,
    flowGroup: wizard.type === 'advanced' ? wizard.stepTitle : id,
    flowTitle: wizard.type === 'advanced' ? wizard.stepTitle : (story.name ?? id),
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
      description: option.description,
      previewStyle: styleObjectToString(tokensToStyle(option.tokens as never) as Record<string, string>),
      tokens: option.tokens,
    })),
    type: 'preset',
  };
};

const createEditableTokenGroup = (
  storyId: string,
  story: StoryWizardStory,
  presetTokenPaths: Set<string>,
): StoryWizardEditableTokenGroup | null => {
  const editableTokens = collectEditableTokenPaths(story.parameters?.editableTokens);
  const filteredTokens = editableTokens.filter((token) => !presetTokenPaths.has(token.path));

  if (filteredTokens.length === 0) {
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
    tokens: filteredTokens,
    type: 'editable-tokens',
  };
};

const collectPresetTokenPaths = (stories: StoryEntry[]) => {
  return new Set(
    stories.flatMap(([, story]) =>
      (story.parameters?.presets ?? []).flatMap((preset) =>
        preset.options.flatMap((option) => collectEditableTokenPaths(option.tokens).map((token) => token.path)),
      ),
    ),
  );
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

  if (wizard.type === 'advanced') {
    return [toPreviewStory(id, story)];
  }

  return wizard.previewStoryIds.flatMap((previewStoryId) => {
    const previewStory = storyMap.get(previewStoryId);
    return previewStory ? [toPreviewStory(previewStoryId, previewStory)] : [];
  });
};

const toPreviewStory = (id: string, story: StoryWizardStory): StoryWizardPreview => {
  return {
    id,
    name: story.name ?? id,
  };
};
