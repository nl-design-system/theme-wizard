import type { StoryWizardNavigationState } from './StoryWizardNavigationState';
import type { StoryWizardStep } from './StoryWizardStep';

export interface NavigationCallbacks {
  onFinishSafe: () => void;
  onJumpTo: (index: number) => void;
  onReset: () => void;
  onShowOverview: () => void;
}

export class StoryWizardNavigation {
  readonly #finishSafeBtns: HTMLButtonElement[];
  readonly #resetBtns: HTMLButtonElement[];
  readonly #overviewCards: HTMLButtonElement[];
  readonly #backOverviewBtns: HTMLButtonElement[];
  readonly #transitionNotes: HTMLElement[];
  readonly #steppers: HTMLElement[];
  readonly #overview: HTMLElement | null;

  public constructor(root: HTMLElement | Document, shell: HTMLElement | Document) {
    this.#steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.#finishSafeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-finish-safe'));
    this.#resetBtns = Array.from(shell.querySelectorAll<HTMLButtonElement>('.wizard-preset-reset'));
    this.#overviewCards = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-step-overview-card]'));
    this.#backOverviewBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-back-overview'));
    this.#transitionNotes = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-transition-note'));
    this.#overview = (root as HTMLElement).querySelector?.('[data-steps-overview]') ?? null;
  }

  public bind(callbacks: NavigationCallbacks) {
    this.#resetBtns.forEach((btn) => btn.addEventListener('click', callbacks.onReset));
    this.#finishSafeBtns.forEach((btn) => btn.addEventListener('click', callbacks.onFinishSafe));
    this.#backOverviewBtns.forEach((btn) => btn.addEventListener('click', callbacks.onShowOverview));

    this.#overviewCards.forEach((card) => {
      const index = parseInt(card.dataset.jumpToStep ?? '-1', 10);
      if (index >= 0) card.addEventListener('click', () => callbacks.onJumpTo(index));
    });
  }

  public showSteppers() {
    this.#steppers.forEach((s) => s.removeAttribute('hidden'));
  }

  public hideSteppers() {
    this.#steppers.forEach((s) => s.setAttribute('hidden', ''));
  }

  public showOverview() {
    this.#overview?.removeAttribute('hidden');
  }

  public hideOverview() {
    this.#overview?.setAttribute('hidden', '');
  }

  public updateStepNavState(_currentIndex: number, steps: StoryWizardStep[]) {
    this.#overviewCards.forEach((card, i) => {
      const isDone = steps[i]?.hasChosenSelection() ?? false;
      card.closest('.wizard-step-overview-card')?.classList.toggle('wizard-step-overview-card--done', isDone);

      const checkEl = card
        .closest('.wizard-step-overview-card')
        ?.querySelector<HTMLElement>('.wizard-step-overview-card__done');
      if (checkEl) checkEl.hidden = !isDone;

      card.textContent = isDone ? 'Aanpassen' : 'Stel in';
      card.classList.toggle('nl-button--primary', !isDone);
      card.classList.toggle('nl-button--secondary', isDone);
    });
  }

  // Kept for the finish-safe flow in StoryWizardController
  public updateNextState(step: StoryWizardStep, nav: StoryWizardNavigationState) {
    const isComplete = step.hasRequiredSelections();
    const { isLastSafeStep } = nav;
    const showSafeFinish = isLastSafeStep && isComplete;

    this.#finishSafeBtns.forEach((btn) => {
      btn.hidden = !showSafeFinish;
    });

    this.#transitionNotes.forEach((note) => {
      note.hidden = !isLastSafeStep;
      note.textContent = isLastSafeStep ? 'Je kunt nu stoppen of nog meer aanpassen.' : '';
    });
  }

  // No-op — prev state is no longer used in non-linear navigation
  public updatePrevState(_isFirstStep: boolean) {}
}
