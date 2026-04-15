import type { StoryWizardStepState } from './types';

export class StoryWizardNavigation {
  readonly #overviewCardMap: Map<string, HTMLElement>;
  readonly #originalListMap: Map<string, HTMLElement>;
  readonly #steppers: HTMLElement[];
  readonly #overview: HTMLElement | null;
  readonly #completedRow: HTMLElement | null;
  readonly #completedList: HTMLElement | null;
  readonly #completedCount: HTMLElement | null;
  readonly #todoRow: HTMLElement | null;
  readonly #todoCount: HTMLElement | null;
  readonly #allDoneCheckmark: HTMLElement | null;
  readonly #filterAdvancedBtn: HTMLButtonElement | null;
  readonly #filterAdvancedCount: HTMLElement | null;
  #filterAdvancedActive = false;
  #stepsState: StoryWizardStepState[] = [];

  public constructor(root: HTMLElement | Document, shell: HTMLElement | Document) {
    this.#steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.#overviewCardMap = new Map(
      Array.from(root.querySelectorAll<HTMLElement>('[data-step-overview-card]'))
        .map((card): [string, HTMLElement] | null => {
          const id = card.dataset.stepOverviewCard;
          return id ? [id, card] : null;
        })
        .filter((entry): entry is [string, HTMLElement] => entry !== null),
    );
    this.#originalListMap = new Map(
      Array.from(root.querySelectorAll<HTMLElement>('[data-step-overview-card]'))
        .map((card) => {
          const id = card.dataset.stepOverviewCard;
          const list = card.closest<HTMLElement>('.wizard-steps-overview__list');
          return id && list ? [id, list] : null;
        })
        .filter((entry): entry is [string, HTMLElement] => entry !== null),
    );
    this.#overview = (root as HTMLElement).querySelector?.('[data-steps-overview]') ?? null;
    this.#completedRow = (root as HTMLElement).querySelector?.('[data-completed-row]') ?? null;
    this.#completedList = (root as HTMLElement).querySelector?.('[data-completed-list]') ?? null;
    this.#completedCount = (root as HTMLElement).querySelector?.('[data-completed-count]') ?? null;
    this.#todoRow = (root as HTMLElement).querySelector?.('[data-todo-row]') ?? null;
    this.#todoCount = (root as HTMLElement).querySelector?.('[data-todo-count]') ?? null;
    this.#allDoneCheckmark = shell.querySelector<HTMLElement>('[data-wizard-all-done-checkmark]');
    this.#filterAdvancedBtn = (root as HTMLElement).querySelector?.('[data-filter-todo-advanced]') ?? null;
    this.#filterAdvancedCount = (root as HTMLElement).querySelector?.('[data-filter-count-advanced]') ?? null;
  }

  public bind() {
    this.#filterAdvancedBtn?.addEventListener('click', () => {
      this.#filterAdvancedActive = !this.#filterAdvancedActive;
      this.#filterAdvancedBtn!.setAttribute('aria-pressed', String(this.#filterAdvancedActive));
      this.#filterAdvancedBtn!.classList.toggle('nl-button--pressed', this.#filterAdvancedActive);
      this.#applyAdvancedFilter();
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

  #applyAdvancedFilter() {
    this.#stepsState.forEach((state) => {
      if (!state.step.isAdvanced) return;
      const card = this.#overviewCardMap.get(state.step.element.id);
      const item = card?.closest<HTMLElement>('.wizard-steps-overview__item');
      if (!item) return;
      item.hidden = this.#filterAdvancedActive && state.isDone;
    });
  }

  public updateStepNavState(_currentIndex: number, stepsState: StoryWizardStepState[]) {
    this.#stepsState = stepsState;
    let completedPresetCount = 0;

    if (this.#filterAdvancedCount) {
      const advancedSteps = stepsState.filter((s) => s.step.isAdvanced);
      const undoneAdvancedCount = advancedSteps.filter((s) => !s.isDone).length;
      const shouldShowAdvancedFilter = undoneAdvancedCount > 0 && undoneAdvancedCount < advancedSteps.length;

      this.#filterAdvancedCount.textContent = String(undoneAdvancedCount);
      this.#filterAdvancedBtn?.toggleAttribute('hidden', !shouldShowAdvancedFilter);

      if (!shouldShowAdvancedFilter && this.#filterAdvancedActive) {
        this.#filterAdvancedActive = false;
        this.#filterAdvancedBtn?.setAttribute('aria-pressed', 'false');
        this.#filterAdvancedBtn?.classList.remove('nl-button--pressed');
      }
    }

    stepsState.forEach((state) => {
      const card = this.#overviewCardMap.get(state.step.element.id);
      if (!card) return;
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

      if (!state.step.isAdvanced) {
        this.#movePresetCard(state.step.element.id, isDone);
        if (isDone) completedPresetCount += 1;
      }
    });

    if (this.#completedRow) {
      this.#completedRow.hidden = completedPresetCount === 0;
    }

    if (this.#completedCount) {
      this.#completedCount.textContent = String(completedPresetCount);
    }

    const presetTotal = stepsState.filter((s) => !s.step.isAdvanced).length;
    const todoPresetCount = presetTotal - completedPresetCount;

    if (this.#todoCount) {
      this.#todoCount.textContent = String(todoPresetCount);
    }

    if (this.#todoRow) {
      this.#todoRow.hidden = todoPresetCount === 0;
    }

    if (this.#allDoneCheckmark) {
      this.#allDoneCheckmark.hidden = completedPresetCount < presetTotal || presetTotal === 0;
    }

    this.#applyAdvancedFilter();
  }

  #movePresetCard(stepId: string, isDone: boolean) {
    const card = this.#overviewCardMap.get(stepId);
    const item = card?.closest<HTMLElement>('.wizard-steps-overview__item');
    if (!item) return;

    if (isDone) {
      this.#completedList?.appendChild(item);
      return;
    }

    const originalList = this.#originalListMap.get(stepId);
    originalList?.appendChild(item);
  }

  #updateCardSummary(btn: HTMLElement, state: StoryWizardStepState) {
    const card = btn.closest('.wizard-step-overview-card');
    const summaryContainer = card?.querySelector<HTMLElement>('[data-step-selection-summary]');
    if (!summaryContainer) return;

    const { isDone, summaries } = state;

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
}
