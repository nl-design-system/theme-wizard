import type { StoryWizardState } from './StoryWizardState';
import type { StoryWizardStep } from './StoryWizardStep';

/**
 * Centralizes all wizard navigation state and derived step metadata.
 *
 * - Precomputed from steps (immutable after construction): total, hasAdvancedSteps, lastSafeStepIndex
 * - Derived helpers: isFirstStep, isLastStep, isLastSafeStep
 */
export class StoryWizardNavigationState {
  public readonly total: number;
  public readonly hasAdvancedSteps: boolean;

  public constructor(steps: StoryWizardStep[]) {
    this.total = steps.length;
    this.hasAdvancedSteps = steps.some((step) => step.isAdvanced);
  }

  public getCurrentStep(state: StoryWizardState) {
    return state.currentStep;
  }

  public isFirstStep(state: StoryWizardState) {
    return state.currentStep === 0;
  }

  public isLastStep(state: StoryWizardState) {
    return state.currentStep === this.total - 1;
  }
}
