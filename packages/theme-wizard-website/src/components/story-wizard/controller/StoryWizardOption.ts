import type { WizardTokenPresetInput } from './types';

export class StoryWizardOption {
  public constructor(public readonly input: WizardTokenPresetInput) {}

  public get isChecked() {
    return this.input.checked;
  }

  public get optionLabel() {
    return this.input.dataset.optionLabel?.trim() ?? '';
  }

  public get previewStyle() {
    return this.input.dataset.previewStyle ?? '';
  }

  public get tokens() {
    try {
      return JSON.parse(this.input.dataset.tokens || '{}');
    } catch {
      return {};
    }
  }

  public setChecked(isChecked: boolean) {
    this.input.checked = isChecked;
  }

  public bindChange(listener: () => void) {
    this.input.addEventListener('change', listener);
  }
}
