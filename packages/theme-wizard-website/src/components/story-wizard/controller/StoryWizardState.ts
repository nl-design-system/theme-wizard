import type { StoryWizardStep } from './StoryWizardStep';
import type { StoryWizardStoredState, StoryWizardStoredStepState } from './types';

export class StoryWizardState {
  #currentStep = 0;
  #steps: StoryWizardStoredStepState[];

  public constructor(steps: StoryWizardStep[]) {
    this.#steps = steps.map((step) => this.#captureStep(step));
  }

  public get currentStep() {
    return this.#currentStep;
  }

  public goToStep(index: number) {
    this.#currentStep = index;
  }

  public capture(currentStep: number, steps: StoryWizardStep[]): StoryWizardStoredState {
    this.#currentStep = currentStep;
    this.#steps = steps.map((step, index) => this.#captureStep(step, this.#steps[index]));

    return this.snapshot();
  }

  public snapshot(): StoryWizardStoredState {
    return {
      currentStep: this.#currentStep,
      steps: this.#steps,
    };
  }

  public reset(steps: StoryWizardStep[]): StoryWizardStoredState {
    this.#currentStep = 0;
    this.#steps = steps.map((step) => this.#captureStep(step));

    return this.snapshot();
  }

  public markPresetGroupChosen(stepIndex: number, groupIndex: number, isChosen: boolean) {
    const step = this.#steps[stepIndex];
    if (!step) return;

    step.chosenSelections[groupIndex] = Boolean(isChosen && step.selections[groupIndex] >= 0);
  }

  public confirmPresetStep(stepIndex: number, steps: StoryWizardStep[]) {
    const stepState = this.#steps[stepIndex];
    const step = steps[stepIndex];
    if (!stepState || !step) return;

    stepState.chosenSelections = step.groups.map((group) => group.hasSelection());
  }

  public confirmAdvancedStep(stepIndex: number) {
    const step = this.#steps[stepIndex];
    if (!step) return;

    step.advancedVisited = true;
  }

  public hasChosenSelection(stepIndex: number) {
    return this.#steps[stepIndex]?.chosenSelections.some(Boolean) ?? false;
  }

  public getChosenSelections(stepIndex: number) {
    return this.#steps[stepIndex]?.chosenSelections ?? [];
  }

  public hasBeenVisited(stepIndex: number) {
    return this.#steps[stepIndex]?.advancedVisited ?? false;
  }

  public restore(
    storedState: StoryWizardStoredState | null,
    steps: StoryWizardStep[],
  ): { hasStoredState: boolean; restoredStepIndex: number } {
    if (!storedState) {
      this.#steps = steps.map((step) => this.#captureStep(step));
      this.#currentStep = 0;
      return { hasStoredState: false, restoredStepIndex: 0 };
    }

    storedState.steps?.forEach((storedStep, index) => {
      if (!storedStep) return;

      steps[index]?.restoreStoredSelection(storedStep.selections);
    });

    this.#steps = steps.map((step, index) => storedState.steps[index] ?? this.#captureStep(step));

    const validStep =
      typeof storedState.currentStep === 'number' &&
      storedState.currentStep >= 0 &&
      storedState.currentStep < steps.length;

    this.#currentStep = validStep ? storedState.currentStep : 0;

    return {
      hasStoredState: true,
      restoredStepIndex: this.#currentStep,
    };
  }

  #captureStep(step: StoryWizardStep, previous?: StoryWizardStoredStepState): StoryWizardStoredStepState {
    const selections = step.getStoredSelection();

    return {
      advancedVisited: previous?.advancedVisited ?? false,
      chosenSelections: selections.map((selectedIndex, groupIndex) =>
        selectedIndex >= 0 ? Boolean(previous?.chosenSelections[groupIndex]) : false,
      ),
      selections,
    };
  }
}
