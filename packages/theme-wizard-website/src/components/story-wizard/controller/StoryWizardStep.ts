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

  public clearSelections() {
    this.groups.forEach((group) => group.clearSelection());
  }

  public restoreDefaultSelection(force = false) {
    this.groups.forEach((group) => group.restoreDefaultSelection(force));
  }

  public getStoredSelection() {
    return this.groups.map((group) => group.getSelectedIndex());
  }

  public restoreStoredSelection(selection: number[]) {
    this.groups.forEach((group, groupIndex) => {
      const selectedIndex = selection[groupIndex];
      if (typeof selectedIndex !== 'number') return;
      group.restoreSelectedIndex(selectedIndex);
    });
  }

  public hasRequiredSelections() {
    return this.groups.every((group) => group.hasSelection());
  }

  public getPreviewStyle() {
    return this.groups
      .map((group) => group.getSelectedOption()?.previewStyle || '')
      .filter(Boolean)
      .join(';');
  }

  public createSelectionSummaryFromChosenSelections(chosenSelections: boolean[]): StoryWizardSelectionSummary[] {
    const chosenOptions = this.groups.flatMap((group, groupIndex) => {
      if (!chosenSelections[groupIndex]) return [];
      const option = group.getSelectedOption();
      return option ? [option] : [];
    });

    if (chosenOptions.length === 0) return [];

    return [
      {
        label: this.stepLabel,
        optionLabel: chosenOptions.map((o) => o.optionLabel).join(' · '),
        tokens: chosenOptions.flatMap((o) => flattenDesignTokens(o.tokens)),
      },
    ];
  }

  public createCurrentSelectionSummary(): StoryWizardSelectionSummary[] {
    const selectedOptions = this.groups.flatMap((group) => {
      const option = group.getSelectedOption();
      return option ? [option] : [];
    });

    if (selectedOptions.length === 0) return [];

    return [
      {
        label: this.stepLabel,
        optionLabel: selectedOptions.map((o) => o.optionLabel).join(' · '),
        tokens: selectedOptions.flatMap((o) => flattenDesignTokens(o.tokens)),
      },
    ];
  }
}
