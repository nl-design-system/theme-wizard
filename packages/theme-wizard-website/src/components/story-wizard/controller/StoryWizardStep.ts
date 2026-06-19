import { StoryWizardGroup } from './StoryWizardGroup';

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

  public getPreviewStyle() {
    return this.groups
      .map((group) => group.getSelectedOption()?.previewStyle || '')
      .filter(Boolean)
      .join(';');
  }
}
