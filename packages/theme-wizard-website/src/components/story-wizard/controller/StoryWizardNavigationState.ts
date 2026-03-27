import type { StoryWizardStep } from './StoryWizardStep';

/**
 * Centralizes all wizard navigation state and derived step metadata.
 *
 * - Mutable state: currentStep, hasFinishedAllChoices
 * - Precomputed from steps (immutable after construction): total, hasAdvancedSteps, lastSafeStepIndex
 * - Derived getters: isFirstStep, isLastStep, isLastSafeStep
 */
export class StoryWizardNavigationState {
  private _currentStep = 0;
  private _hasFinishedAllChoices = false;

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
    return this._currentStep;
  }

  public get hasFinishedAllChoices() {
    return this._hasFinishedAllChoices;
  }

  public get isFirstStep() {
    return this._currentStep === 0;
  }

  public get isLastStep() {
    return this._currentStep === this.total - 1;
  }

  public get isLastSafeStep() {
    return this.lastSafeStepIndex >= 0 && this._currentStep === this.lastSafeStepIndex && this.hasAdvancedSteps;
  }

  public goTo(index: number) {
    if (index !== this.total - 1) {
      this._hasFinishedAllChoices = false;
    }
    this._currentStep = index;
  }

  public finish() {
    this._hasFinishedAllChoices = true;
  }

  public reset() {
    this._currentStep = 0;
    this._hasFinishedAllChoices = false;
  }
}
