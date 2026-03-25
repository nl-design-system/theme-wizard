import type { DesignTokenLeaf, StoryWizardSelectionSummary } from './types';
import { StoryWizardGroup } from './StoryWizardGroup';

const flattenDesignTokens = (tokens: unknown, path: string[] = []): DesignTokenLeaf[] => {
  if (!tokens || typeof tokens !== 'object') return [];

  if ('$value' in (tokens as Record<string, unknown>)) {
    const rawValue = (tokens as { $value: unknown }).$value;

    return [
      {
        path: path.join('.'),
        value:
          typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue) : JSON.stringify(rawValue),
      },
    ];
  }

  return Object.entries(tokens as Record<string, unknown>).flatMap(([key, value]) =>
    flattenDesignTokens(value, [...path, key]),
  );
};

export class StoryWizardStep {
  public readonly groups: StoryWizardGroup[];
  public readonly editableTokenPaths: string[];
  private wasVisited = false;

  public constructor(public readonly element: HTMLElement) {
    this.groups = Array.from(element.querySelectorAll<HTMLElement>('[data-preset-group]')).map(
      (group) => new StoryWizardGroup(group),
    );
    this.editableTokenPaths = Array.from(element.querySelectorAll<HTMLElement>('[data-editable-token-paths]')).flatMap(
      (group) => {
        try {
          const tokenPaths = JSON.parse(group.dataset.editableTokenPaths || '[]');
          return Array.isArray(tokenPaths) ? tokenPaths.filter((path): path is string => typeof path === 'string') : [];
        } catch {
          return [];
        }
      },
    );
  }

  public get stepLabel() {
    return this.element.dataset.stepLabel || '';
  }

  public get isAdvanced() {
    return this.element.dataset.stepKind === 'advanced';
  }

  public hide() {
    this.element.hidden = true;
  }

  public show() {
    this.element.hidden = false;
  }

  public bindOptions(listener: (group: StoryWizardGroup) => void) {
    this.groups.forEach((group) => group.bindOptions(listener));
  }

  public clearSelections() {
    this.wasVisited = false;
    this.groups.forEach((group) => group.clearSelection());
  }

  public restoreDefaultSelection(force = false) {
    this.groups.forEach((group) => group.restoreDefaultSelection(force));
  }

  public getStoredSelection() {
    return this.groups.map((group) => group.getSelectedIndex());
  }

  public getStoredChosenState() {
    return this.groups.map((group) => group.getStoredChosenState());
  }

  public getStoredVisitedState() {
    return this.wasVisited;
  }

  public restoreStoredSelection(selection: number[]) {
    this.groups.forEach((group, groupIndex) => {
      const selectedIndex = selection?.[groupIndex];
      if (typeof selectedIndex !== 'number') return;
      group.restoreSelectedIndex(selectedIndex);
    });
  }

  public restoreChosenState(chosenState: boolean[]) {
    this.groups.forEach((group, groupIndex) => {
      group.restoreChosenState(Boolean(chosenState?.[groupIndex]));
    });
  }

  public restoreVisitedState(wasVisited: boolean) {
    this.wasVisited = wasVisited;
  }

  public hasRequiredSelections() {
    return this.groups.every((group) => group.hasSelection());
  }

  public hasChosenSelection() {
    return this.groups.some((group) => group.hasChosenSelection());
  }

  public hasBeenVisited() {
    return this.wasVisited;
  }

  public confirmAdvancedSelection() {
    this.wasVisited = true;
  }

  public confirmSelections() {
    this.groups.forEach((group) => group.confirmSelection());
  }

  public getPreviewStyle() {
    return this.groups
      .map((group) => group.getSelectedOption()?.previewStyle || '')
      .filter(Boolean)
      .join(';');
  }

  public createSelectionSummary(): StoryWizardSelectionSummary[] {
    const selectedGroups = this.groups.flatMap((group) => {
      const option = group.getSelectedOption();
      if (!option || !group.hasChosenSelection()) return [];

      return [
        {
          label: group.groupLabel,
          optionLabel: option.optionLabel,
          tokens: flattenDesignTokens(option.tokens),
        },
      ];
    });

    if (selectedGroups.length === 0) {
      return [];
    }

    return [
      {
        label: this.stepLabel,
        optionLabel: selectedGroups.map((group) => group.optionLabel).join(' · '),
        tokens: selectedGroups.flatMap((group) => group.tokens),
      },
    ];
  }
}
