import type { DesignTokenLeaf, StoryWizardSelectionSummary } from './types';
import { StoryWizardGroup } from './StoryWizardGroup';

export class StoryWizardStep {
  public readonly groups: StoryWizardGroup[];

  public constructor(public readonly element: HTMLElement) {
    this.groups = Array.from(element.querySelectorAll<HTMLElement>('[data-preset-group]')).map(
      (group) => new StoryWizardGroup(group),
    );
  }

  public get stepLabel() {
    return this.element.dataset.stepLabel || '';
  }

  public hide() {
    this.element.hidden = true;
  }

  public show() {
    this.element.hidden = false;
  }

  public bindOptions(listener: () => void) {
    this.groups.forEach((group) => group.bindOptions(listener));
  }

  public getStoredSelection() {
    return this.groups.map((group) => group.getSelectedIndex());
  }

  public restoreStoredSelection(selection: number[]) {
    this.groups.forEach((group, groupIndex) => {
      const selectedIndex = selection?.[groupIndex];
      if (typeof selectedIndex !== 'number') return;
      group.restoreSelectedIndex(selectedIndex);
    });
  }

  public hasRequiredSelections() {
    return this.groups.every((group) => group.hasSelection());
  }

  public getSelectionLabels() {
    return this.groups.flatMap((group) => {
      const label = group.getSelectionLabel();
      return label ? [label] : [];
    });
  }

  public getPreviewStyle() {
    return this.groups
      .map((group) => group.getSelectedOption()?.previewStyle || '')
      .filter(Boolean)
      .join(';');
  }

  public applyPreviewStyle() {
    const previewStyle = this.getPreviewStyle();

    this.element
      .querySelectorAll<HTMLElement>('.wizard-story-section__variants wizard-preview-theme')
      .forEach((preview) => {
        if (previewStyle) {
          preview.setAttribute('style', previewStyle);
        } else {
          preview.removeAttribute('style');
        }
      });
  }

  public createSelectionSummary(
    flattenTokens: (tokens: unknown, path?: string[]) => DesignTokenLeaf[],
  ): StoryWizardSelectionSummary[] {
    return this.groups.flatMap((group) => {
      const option = group.getSelectedOption();
      if (!option) return [];

      return [
        {
          label: group.groupLabel,
          optionLabel: option.optionLabel,
          tokens: flattenTokens(option.tokens),
        },
      ];
    });
  }
}
