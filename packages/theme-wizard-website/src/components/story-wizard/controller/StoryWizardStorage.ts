import type { StoryWizardStep } from './StoryWizardStep';

interface StoredState {
  chosenSections: boolean[][];
  currentStep: number;
  sections: number[][];
  visitedSections: boolean[];
}

export class StoryWizardStorage {
  readonly #key: string;
  #lastSerializedState: string | null = null;

  public constructor(componentId: string) {
    this.#key = `theme-wizard:${componentId}:preset-state`;
  }

  public read(): StoredState | null {
    try {
      const raw = globalThis.localStorage?.getItem(this.#key);
      this.#lastSerializedState = raw;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public write(currentStep: number, steps: StoryWizardStep[]) {
    try {
      const state: StoredState = {
        chosenSections: steps.map((step) => step.getStoredChosenState()),
        currentStep,
        sections: steps.map((step) => step.getStoredSelection()),
        visitedSections: steps.map((step) => step.getStoredVisitedState()),
      };

      const serializedState = JSON.stringify(state);
      if (serializedState === this.#lastSerializedState) {
        return;
      }

      globalThis.localStorage?.setItem(this.#key, serializedState);
      this.#lastSerializedState = serializedState;
    } catch {
      // Progressive enhancement: ignore storage failures and keep the wizard usable.
    }
  }

  public clear() {
    try {
      globalThis.localStorage?.removeItem(this.#key);
      this.#lastSerializedState = null;
    } catch {
      // Progressive enhancement: ignore storage failures and keep the wizard usable.
    }
  }

  public restore(steps: StoryWizardStep[]): { hasStoredState: boolean; restoredStepIndex: number } {
    const stored = this.read();

    if (!stored) {
      return { hasStoredState: false, restoredStepIndex: 0 };
    }

    stored.sections?.forEach((selection: number[], index: number) => {
      steps[index]?.restoreStoredSelection(selection);
    });

    stored.chosenSections?.forEach((chosenState: boolean[], index: number) => {
      steps[index]?.restoreChosenState(chosenState);
    });

    stored.visitedSections?.forEach((wasVisited: boolean, index: number) => {
      steps[index]?.restoreVisitedState(wasVisited);
    });

    const validStep =
      typeof stored.currentStep === 'number' && stored.currentStep >= 0 && stored.currentStep < steps.length;

    return {
      hasStoredState: true,
      restoredStepIndex: validStep ? stored.currentStep : 0,
    };
  }
}
