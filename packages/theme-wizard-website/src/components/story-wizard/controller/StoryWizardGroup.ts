import type { StoryWizardPresetOption, WizardTokenPresetInput } from './types';

export class StoryWizardGroup {
  public readonly input: WizardTokenPresetInput | null;
  readonly #initialOptions: StoryWizardPresetOption[];

  public constructor(public readonly element: HTMLElement) {
    this.input = element.querySelector<WizardTokenPresetInput>('.wizard-token-preset__input');
    this.#initialOptions = structuredClone(this.input?.options ?? []);
  }

  public get groupLabel() {
    return this.element.dataset.groupLabel?.trim() ?? '';
  }

  public getSelectedOption() {
    return this.input?.selectedOption ?? null;
  }

  public getSelectedIndex() {
    return this.input?.selectedIndex ?? -1;
  }

  public getOptions() {
    return this.input?.options ?? [];
  }

  public getInitialOptions() {
    return this.#initialOptions;
  }

  public hasSelection() {
    return this.getSelectedIndex() >= 0;
  }

  public clearSelection() {
    this.input?.clearSelection();
  }

  public restoreSelectedIndex(index: number) {
    this.input?.selectIndex(index);
  }

  public restoreDefaultSelection(force = false) {
    if (!this.input || this.input.options.length === 0 || (!force && this.hasSelection())) {
      return;
    }

    const defaultIndex = Math.max(this.input.defaultIndex, 0);
    this.restoreSelectedIndex(defaultIndex);
  }

  public setOptions(options: StoryWizardPresetOption[]) {
    if (!this.input) return;

    this.input.options = options;
  }

  public bindOptions(listener: () => void) {
    this.input?.addEventListener('change', listener);
  }
}
