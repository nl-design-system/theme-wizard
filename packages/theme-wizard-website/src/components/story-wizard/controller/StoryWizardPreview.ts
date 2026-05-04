import type { StoryWizardStep } from './StoryWizardStep';

export class StoryWizardPreview {
  #lastMergedStyle: string | null = null;

  public apply(steps: StoryWizardStep[]) {
    const mergedStyle = steps
      .map((step) => step.getPreviewStyle())
      .filter(Boolean)
      .join(';');

    if (mergedStyle === this.#lastMergedStyle) {
      return;
    }

    this.#lastMergedStyle = mergedStyle;

    steps.forEach((step) => {
      step.element
        .querySelectorAll<HTMLElement>('.wizard-story-section__variants wizard-preview-theme')
        .forEach((preview) => {
          if (mergedStyle) {
            preview.setAttribute('style', mergedStyle);
          } else {
            preview.removeAttribute('style');
          }
        });
    });
  }
}
