import type { WizardTokenPresetInput } from './types';

export class StoryWizardOption {
  public constructor(public readonly input: WizardTokenPresetInput) {}

  public get optionLabel() {
    return this.input.dataset.optionLabel?.trim() ?? '';
  }

  public get previewStyle() {
    return this.input.dataset.previewStyle ?? '';
  }

  public get tokens() {
    return (this.input as HTMLElement & { value?: unknown }).value ?? {};
  }

  public dispatchChange() {
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  public bindChange(listener: () => void) {
    this.input.addEventListener('change', listener);
  }
}
