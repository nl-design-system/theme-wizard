import type { StoryWizardNavigationState } from './StoryWizardNavigationState';
import type { StoryWizardStep } from './StoryWizardStep';

export interface NavigationCallbacks {
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onFinishSafe: () => void;
}

export class StoryWizardNavigation {
  readonly #finishSafeBtns: HTMLButtonElement[];
  readonly #nextBtns: HTMLButtonElement[];
  readonly #prevBtns: HTMLButtonElement[];
  readonly #resetBtns: HTMLButtonElement[];
  readonly #transitionNotes: HTMLElement[];
  readonly #steppers: HTMLElement[];

  public constructor(root: HTMLElement | Document, shell: HTMLElement | Document) {
    this.#steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.#finishSafeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-finish-safe'));
    this.#resetBtns = Array.from(shell.querySelectorAll<HTMLButtonElement>('.wizard-preset-reset'));
    this.#prevBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-prev'));
    this.#nextBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-next'));
    this.#transitionNotes = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-transition-note'));
  }

  public bind(callbacks: NavigationCallbacks) {
    this.#resetBtns.forEach((btn) => btn.addEventListener('click', callbacks.onReset));
    this.#prevBtns.forEach((btn) => btn.addEventListener('click', callbacks.onPrev));
    this.#nextBtns.forEach((btn) => btn.addEventListener('click', callbacks.onNext));
    this.#finishSafeBtns.forEach((btn) => btn.addEventListener('click', callbacks.onFinishSafe));
  }

  public showSteppers() {
    this.#steppers.forEach((stepper) => stepper.removeAttribute('hidden'));
  }

  public hideSteppers() {
    this.#steppers.forEach((stepper) => stepper.setAttribute('hidden', ''));
  }

  public updatePrevState(isFirstStep: boolean) {
    this.#prevBtns.forEach((btn) => {
      btn.disabled = isFirstStep;
      btn.classList.toggle('nl-button--disabled', isFirstStep);
    });
  }

  public updateNextState(step: StoryWizardStep, nav: StoryWizardNavigationState) {
    const isComplete = step.hasRequiredSelections();
    const { isLastSafeStep, isLastStep } = nav;
    const showSafeFinish = isLastSafeStep && isComplete;
    let nextLabel = 'Volgende';

    if (isLastStep) {
      nextLabel = 'Afronden';
    } else if (isLastSafeStep) {
      nextLabel = 'Geavanceerd';
    }

    this.#nextBtns.forEach((btn) => {
      btn.disabled = !isComplete;
      btn.classList.toggle('nl-button--disabled', !isComplete);
      btn.textContent = nextLabel;
      btn.classList.toggle('nl-button--primary', !isLastSafeStep || isLastStep);
      btn.classList.toggle('nl-button--subtle', isLastSafeStep && !isLastStep);
    });

    this.#finishSafeBtns.forEach((btn) => {
      btn.hidden = !showSafeFinish;
    });

    this.#transitionNotes.forEach((note) => {
      note.hidden = !isLastSafeStep;
      note.textContent = isLastSafeStep ? 'Je kunt nu afronden of doorgaan naar geavanceerde instellingen.' : '';
    });
  }
}
