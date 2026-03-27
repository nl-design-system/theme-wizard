import type { StoryWizardStep } from './StoryWizardStep';

/**
 * Centralizes all wizard navigation state and derived step metadata.
 *
 * - Mutable state: currentStep, hasFinishedAllChoices
 * - Precomputed from steps (immutable after construction): total, hasAdvancedSteps, lastSafeStepIndex
 * - Derived getters: isFirstStep, isLastStep, isLastSafeStep
 */
export class StoryWizardNavigationState {
  #currentStep = 0;
  #hasFinishedAllChoices = false;

  public readonly total: number;
  public readonly hasAdvancedSteps: boolean;
  public readonly lastSafeStepIndex: number;

  public constructor(steps: StoryWizardStep[]) {
    this.total = steps.length;
    this.hasAdvancedSteps = steps.some((step) => step.isAdvanced);

    const firstAdvanced = steps.findIndex((step) => step.isAdvanced);
    if (firstAdvanced === 0) {
      this.lastSafeStepIndex = -1;
    } else if (firstAdvanced > 0) {
      this.lastSafeStepIndex = firstAdvanced - 1;
    } else {
      this.lastSafeStepIndex = this.total - 1;
    }
  }

  public get currentStep() {
    return this.#currentStep;
  }

  public get hasFinishedAllChoices() {
    return this.#hasFinishedAllChoices;
  }

  public get isFirstStep() {
    return this.#currentStep === 0;
  }

  public get isLastStep() {
    return this.#currentStep === this.total - 1;
  }

  public get isLastSafeStep() {
    return this.lastSafeStepIndex >= 0 && this.#currentStep === this.lastSafeStepIndex && this.hasAdvancedSteps;
  }

  public goTo(index: number) {
    if (index !== this.total - 1) {
      this.#hasFinishedAllChoices = false;
    }
    this.#currentStep = index;
  }

  public finish() {
    this.#hasFinishedAllChoices = true;
  }

  public reset() {
    this.#currentStep = 0;
    this.#hasFinishedAllChoices = false;
  }
}
