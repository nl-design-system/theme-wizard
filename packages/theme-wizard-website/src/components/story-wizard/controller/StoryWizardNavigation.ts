import type { StoryWizardNavigationState } from './StoryWizardNavigationState';
import type { StoryWizardStep } from './StoryWizardStep';
import type { StoryWizardStepState } from './types';

export interface NavigationCallbacks {
  onFinishSafe: () => void;
  onJumpTo: (index: number) => void;
  onReset: () => void;
  onShowOverview: () => void;
}

export class StoryWizardNavigation {
  readonly #finishSafeBtns: HTMLButtonElement[];
  readonly #overviewCards: HTMLElement[];
  readonly #transitionNotes: HTMLElement[];
  readonly #steppers: HTMLElement[];
  readonly #overview: HTMLElement | null;
  readonly #root: HTMLElement | Document;

  public constructor(root: HTMLElement | Document, shell: HTMLElement | Document) {
    this.#root = root;
    this.#steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.#finishSafeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-finish-safe'));
    this.#overviewCards = Array.from(root.querySelectorAll<HTMLElement>('[data-step-overview-card]'));
    this.#transitionNotes = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-transition-note'));
    this.#overview = (root as HTMLElement).querySelector?.('[data-steps-overview]') ?? null;
  }

  public bind(callbacks: NavigationCallbacks) {
    this.#finishSafeBtns.forEach((btn) => btn.addEventListener('click', callbacks.onFinishSafe));

    this.#root.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button');
      if (!target) return;

      // For links with hashes, we let the browser change the hash natively.
      // The StoryWizardController's hashchange listener will pick it up.
      // We only need to handle buttons or cases where preventDefault is necessary.

      if (target.classList.contains('wizard-back-overview-btn')) {
        // e.preventDefault() is NOT called, so hash changes natively to #wizard-overview
      }

      if (target.hasAttribute('data-step-overview-card')) {
        // e.preventDefault() is NOT called, so hash changes natively to #step-id
      }
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

  public updateStepNavState(_currentIndex: number, stepsState: StoryWizardStepState[]) {
    this.#overviewCards.forEach((card, i) => {
      const state = stepsState[i];
      if (!state) return;
      const { isDone } = state;

      card.closest('.wizard-step-overview-card')?.classList.toggle('wizard-step-overview-card--done', isDone);

      const checkEl = card
        .closest('.wizard-step-overview-card')
        ?.querySelector<HTMLElement>('.wizard-step-overview-card__done');
      if (checkEl) checkEl.hidden = !isDone;

      card.textContent = isDone ? 'Aanpassen' : 'Stel in';
      card.classList.toggle('nl-button--primary', !isDone);
      card.classList.toggle('nl-button--secondary', isDone);

      this.#updateCardSummary(card, state);
    });
  }

  #updateCardSummary(btn: HTMLElement, state: StoryWizardStepState) {
    const card = btn.closest('.wizard-step-overview-card');
    const summaryContainer = card?.querySelector<HTMLElement>('[data-step-selection-summary]');
    if (!summaryContainer) return;

    const { summaries, isDone } = state;

    if (!isDone || summaries.length === 0) {
      summaryContainer.hidden = true;
      summaryContainer.innerHTML = '';
      return;
    }

    summaryContainer.hidden = false;
    summaryContainer.replaceChildren();

    summaries.forEach((summary) => {
      const details = document.createElement('details');
      details.className = 'wizard-step-overview-card__summary';

      const summaryTitle = document.createElement('summary');
      summaryTitle.className = 'wizard-step-overview-card__summary-title';
      summaryTitle.textContent = `Gekozen: ${summary.optionLabel}`;
      details.appendChild(summaryTitle);

      const tokenList = document.createElement('ul');
      tokenList.className = 'wizard-step-overview-card__summary-list';

      summary.tokens.forEach((token) => {
        const item = document.createElement('li');
        item.className = 'wizard-step-overview-card__summary-item';

        const path = document.createElement('code');
        path.className = 'wizard-step-overview-card__summary-path';
        path.textContent = token.path;

        const value = document.createElement('code');
        value.className = 'wizard-step-overview-card__summary-value';
        value.textContent = `: ${token.value}`;

        item.appendChild(path);
        item.appendChild(value);
        tokenList.appendChild(item);
      });

      details.appendChild(tokenList);
      summaryContainer.appendChild(details);
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
