import { StoryWizardStorage } from './StoryWizardStorage';

export class StoryWizardOverviewController {
  public static init() {
    const container = document.getElementById('story-wizard');
    if (!container) return;
    new StoryWizardOverviewController(container).#start();
  }

  readonly #storage: StoryWizardStorage;
  readonly #root: Element;

  constructor(container: HTMLElement) {
    this.#storage = new StoryWizardStorage(container.dataset.componentId ?? '');
    this.#root = container.closest('[data-story-wizard-root]') ?? container.parentElement ?? document.body;
  }

  #start() {
    const stored = this.#storage.read();

    const completedRow = this.#root.querySelector<HTMLElement>('[data-completed-row]');
    const completedList = this.#root.querySelector<HTMLElement>('[data-completed-list]');
    const completedCount = this.#root.querySelector<HTMLElement>('[data-completed-count]');
    const todoCount = this.#root.querySelector<HTMLElement>('[data-todo-count]');
    const allDoneCheckmark = document.querySelector<HTMLElement>('[data-wizard-all-done-checkmark]');
    const progressLabel = this.#root.querySelector<HTMLElement>('[data-progress-label]');

    // Build original-list map before moving any cards
    const originalListMap = new Map<string, HTMLElement>();
    this.#root.querySelectorAll<HTMLElement>('[data-step-overview-card]').forEach((card) => {
      const stepId = card.dataset.stepOverviewCard;
      const list = card.closest<HTMLElement>('.wizard-steps-overview__list');
      if (stepId && list) originalListMap.set(stepId, list);
    });

    let completedPresetCount = 0;
    let presetTotal = 0;

    this.#root.querySelectorAll<HTMLElement>('[data-step-overview-card]').forEach((card) => {
      const stepId = card.dataset.stepOverviewCard;
      const stepIndex = parseInt(card.dataset.stepIndex ?? '');
      const isAdvanced = card.dataset.stepType === 'advanced';
      if (!stepId || isNaN(stepIndex)) return;

      const stepState = stored?.steps[stepIndex];
      const isDone = isAdvanced
        ? (stepState?.advancedVisited ?? false)
        : (stepState?.chosenSelections?.some(Boolean) ?? false);

      if (!isAdvanced) {
        presetTotal++;
        if (isDone) completedPresetCount++;
      }

      const article = card.closest<HTMLElement>('.wizard-step-overview-card');
      article?.classList.toggle('wizard-step-overview-card--done', isDone);

      const checkEl = article?.querySelector<HTMLElement>('.wizard-step-overview-card__done');
      if (checkEl) checkEl.hidden = !isDone;

      card.textContent = isDone ? 'Aanpassen' : 'Stel in';
      card.classList.toggle('nl-button--primary', !isDone);
      card.classList.toggle('nl-button--secondary', isDone);

      const statusTag = article?.querySelector<HTMLElement>('[data-step-status-tag]');
      if (statusTag) {
        const labels = stepState?.selectionLabels?.filter(Boolean) ?? [];
        statusTag.textContent = labels.length > 0 ? labels.join(', ') : 'Aangepast';
        statusTag.hidden = !isDone;
      }

      if (!isAdvanced) {
        const item = card.closest<HTMLElement>('.wizard-steps-overview__item');
        if (!item) return;
        if (isDone) {
          completedList?.appendChild(item);
        } else {
          originalListMap.get(stepId)?.appendChild(item);
        }
      }
    });

    if (completedRow) completedRow.hidden = completedPresetCount === 0;
    if (completedCount) completedCount.textContent = String(completedPresetCount);
    if (todoCount) todoCount.textContent = String(presetTotal - completedPresetCount);
    if (allDoneCheckmark) {
      allDoneCheckmark.hidden = completedPresetCount < presetTotal || presetTotal === 0;
    }

    if (progressLabel && presetTotal > 0) {
      progressLabel.hidden = false;
      progressLabel.textContent = `${completedPresetCount} van ${presetTotal} ingesteld`;
    }
  }
}
