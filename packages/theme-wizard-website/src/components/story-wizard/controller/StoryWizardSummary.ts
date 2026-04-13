import refreshIcon from '@tabler/icons/outline/refresh.svg?raw';
import { dequal } from 'dequal';
import dlv from 'dlv';
import type { StoryWizardStep } from './StoryWizardStep';
import type { StoryWizardTokensDialog } from './StoryWizardTokensDialog';
import type { StoryWizardSelectionSummary, StoryWizardStepState, StoryWizardThemeHost } from './types';
import { cloneTemplate } from './cloneTemplate';

export class StoryWizardSummary {
  readonly #componentTitle: string;
  readonly #listElement: HTMLElement | null;
  readonly #summaryElement: HTMLElement | null;
  readonly #summaryResetElement: HTMLElement | null;
  readonly #overviewResetElement: HTMLElement | null;
  readonly #detailsElement: HTMLElement | null;
  readonly #dialog: StoryWizardTokensDialog;
  readonly #onNavigate: (stepIndex: number) => void;
  readonly #onReset: () => void;
  readonly #allDoneCheckmark: HTMLElement | null;

  public constructor(
    root: HTMLElement | Document,
    componentTitle: string,
    dialog: StoryWizardTokensDialog,
    onNavigate: (stepIndex: number) => void,
    onReset: () => void,
  ) {
    this.#componentTitle = componentTitle;
    this.#dialog = dialog;
    this.#onNavigate = onNavigate;
    this.#onReset = onReset;
    this.#summaryElement = root.querySelector<HTMLElement>('.wizard-step-selections__summary');
    this.#summaryResetElement = root.querySelector<HTMLElement>('.wizard-step-selections__summary-reset');
    this.#overviewResetElement = root.querySelector<HTMLElement>('.wizard-steps-overview__reset');
    this.#listElement = root.querySelector<HTMLElement>('.wizard-step-selections__list');
    this.#detailsElement = root.querySelector<HTMLElement>('.wizard-step-selections');
    this.#allDoneCheckmark = this.#summaryElement?.querySelector<HTMLElement>('[data-wizard-summary-all-done-checkmark]') ?? null;
  }

  public show() {
    this.#detailsElement?.removeAttribute('hidden');
  }

  public hide() {
    this.#detailsElement?.setAttribute('hidden', '');
  }

  public openDetails() {
    const details = this.#detailsElement as HTMLDetailsElement | null;
    if (details) details.open = true;
  }

  public update(stepsState: StoryWizardStepState[]) {
    const listElement = this.#listElement;
    if (!listElement) return;

    listElement.replaceChildren();
    this.#summaryResetElement?.replaceChildren();
    this.#overviewResetElement?.replaceChildren();
    if (this.#overviewResetElement) {
      this.#overviewResetElement.hidden = true;
    }
    let completedSteps = 0;
    const allSelectedGroups: StoryWizardSelectionSummary[] = [];
    let hasResettableState = false;

    stepsState.forEach((state, index) => {
      const { isConfirmedAdvanced, isDone, step, summaries } = state;

      hasResettableState = hasResettableState || state.hasResettableState || summaries.length > 0 || isDone || isConfirmedAdvanced;

      if (isDone) {
        completedSteps += 1;
        allSelectedGroups.push(...summaries);
      }

      const stepLabel = step.isAdvanced
        ? `Geavanceerd: ${step.stepLabel || `Stap ${index + 1}`}`
        : (step.stepLabel || `Stap ${index + 1}`);
      const value = this.#createValueElement(summaries, step.isAdvanced, isConfirmedAdvanced);
      const wrapper = this.#createStepWrapper(stepLabel, index, value, step.element.id);
      wrapper.classList.toggle('wizard-step-selection--done', isDone);

      const doneEl = wrapper.querySelector<HTMLElement>('.wizard-step-selection__done');
      if (doneEl) doneEl.hidden = !isDone;

      if (isDone) {
        this.#appendTokensButton(wrapper, stepLabel, summaries);
      }

      listElement.appendChild(wrapper);
    });

    this.#appendTotalTokensButton(allSelectedGroups);

    if (hasResettableState) {
      this.#appendResetButton();
    }

    this.#updateCount(completedSteps, stepsState.length);
  }

  public getAdvancedSummary(
    step: StoryWizardStep,
    themeHost: StoryWizardThemeHost | null,
    options: { includeUnchangedTokens?: boolean } = {},
  ): StoryWizardSelectionSummary[] {
    const theme = themeHost?.theme;
    if (!theme || step.editableTokenPaths.length === 0) return [];

    const { includeUnchangedTokens = false } = options;

    let hasChanges = false;
    const tokens = step.editableTokenPaths.flatMap((path) => {
      const currentToken = theme.at(path);
      const defaultToken = this.#getDefaultToken(theme.defaults, path);
      const currentValue = currentToken?.$value;
      const isChanged = !dequal(currentToken, defaultToken);

      if (isChanged) hasChanges = true;
      if (!includeUnchangedTokens && !isChanged) return [];

      return [{ path, value: this.#formatTokenValue(currentValue) }];
    });

    if (tokens.length === 0) return [];

    return [
      {
        label: `Geavanceerd: ${step.stepLabel}`,
        optionLabel: hasChanges ? tokens.map((t) => `${t.path}: ${t.value}`).join(' \u00b7 ') : 'Standaard',
        tokens,
      },
    ];
  }

  #getDefaultToken(defaults: unknown, path: string) {
    const defaultToken = dlv(defaults && typeof defaults === 'object' ? defaults : undefined, path);

    return defaultToken && typeof defaultToken === 'object' ? defaultToken : undefined;
  }

  #formatTokenValue(value: unknown) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  #updateCount(completed: number, total: number) {
    if (!this.#summaryElement) return;

    const title = this.#summaryElement.querySelector<HTMLElement>('.wizard-step-selections__summary-title');
    const meta = this.#summaryElement.querySelector<HTMLElement>('.wizard-step-selections__summary-meta');
    const details = this.#detailsElement as HTMLDetailsElement | null;

    if (title) {
      title.textContent = completed > 0 ? `Bekijk jouw keuzes (${completed}/${total})` : 'Nog geen keuzes gemaakt';
    }

    if (meta) {
      meta.textContent =
        completed > 0
          ? `${completed} ${completed === 1 ? 'onderdeel is' : 'onderdelen zijn'} ingesteld`
          : 'Open om je ingestelde onderdelen te bekijken';
    }

    details?.toggleAttribute('data-has-selections', completed > 0);
    details?.toggleAttribute('data-all-done', completed === total && total > 0);

    if (this.#allDoneCheckmark) {
      this.#allDoneCheckmark.hidden = !(completed === total && total > 0);
    }
  }

  // --- DOM construction (templates for complex structures, createElement for simple ones) ---

  #createStepWrapper(stepLabel: string, index: number, value: HTMLElement, stepId: string): HTMLElement {
    const wrapper = cloneTemplate<HTMLElement>('wizard-step-selection-tmpl', '.wizard-step-selection');

    wrapper.querySelector('.wizard-step-selection__number')!.textContent = String(index + 1);

    const title = wrapper.querySelector<HTMLAnchorElement>('.wizard-step-selection__title')!;
    title.textContent = stepLabel;
    title.href = `#${stepId}`;
    title.setAttribute('aria-label', `Ga naar: ${stepLabel}`);
    title.addEventListener('click', (e) => {
      e.preventDefault();
      this.#onNavigate(index);
      const details = this.#detailsElement as HTMLDetailsElement | null;
      if (details) details.open = false;
    });

    wrapper.querySelector('.wizard-step-selection__value')!.replaceWith(value);

    return wrapper;
  }

  #appendTokensButton(wrapper: HTMLElement, stepLabel: string, groups: StoryWizardSelectionSummary[]) {
    wrapper.appendChild(
      this.#createTokensButton('Technische details', () => this.#dialog.show(stepLabel, groups), {
        ariaLabel: `Technische details voor: ${stepLabel}`,
      }),
    );
  }

  #appendTotalTokensButton(allGroups: StoryWizardSelectionSummary[]) {
    if (!this.#listElement || allGroups.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'wizard-step-selection wizard-step-selection--total';
    wrapper.appendChild(
      this.#createTokensButton('Alle technische details', () => this.#dialog.show('Alle keuzes', allGroups)),
    );

    this.#listElement.appendChild(wrapper);
  }

  #createTokensButton(label: string, onClick: () => void, options: { ariaLabel?: string } = {}) {
    const btn = document.createElement('button');
    btn.className = 'wizard-step-selection__tokens-btn nl-button nl-button--subtle';
    btn.type = 'button';
    btn.textContent = label;

    if (options.ariaLabel) {
      btn.setAttribute('aria-label', options.ariaLabel);
    }

    btn.addEventListener('click', onClick);
    return btn;
  }

  #appendResetButton() {
    this.#summaryResetElement?.appendChild(this.#createResetButton());
    if (this.#overviewResetElement) {
      this.#overviewResetElement.hidden = false;
      this.#overviewResetElement.appendChild(this.#createResetButton());
    }
  }

  #createResetButton() {
    const btn = document.createElement('button');
    btn.className = 'wizard-preset-reset nl-button nl-button--subtle wizard-summary-reset';
    btn.type = 'button';

    const icon = document.createElement('span');
    icon.className = 'wizard-summary-reset__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = refreshIcon;

    const label = document.createElement('span');
    label.textContent = 'Opnieuw beginnen';

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      // eslint-disable-next-line no-alert
      if (window.confirm(`Weet je zeker dat je alles wilt resetten voor ${this.#componentTitle}?`)) {
        this.#onReset();
      }
    });

    return btn;
  }

  #createValueElement(
    groups: StoryWizardSelectionSummary[],
    isAdvanced: boolean,
    isCompletedAdvancedStep: boolean,
  ): HTMLElement {
    const value = document.createElement('span');
    value.className = 'wizard-step-selection__value';

    if (groups.length === 0) {
      value.textContent =
        isAdvanced && isCompletedAdvancedStep ? 'Standaard' : isAdvanced ? 'Nog niet ingevuld' : 'Nog niet gekozen';

      if (!isAdvanced || !isCompletedAdvancedStep) {
        value.classList.add('wizard-step-selection__value--empty');
      }
      return value;
    }

    const [group] = groups;

    if (groups.length === 1 && group.optionLabel) {
      const option = document.createElement('span');
      option.className = 'wizard-step-selection__value-option';
      option.textContent = group.optionLabel;
      value.appendChild(option);
    }

    if (groups.length === 1 && group.tokens.length <= 1) {
      const token = group.tokens[0];
      if (token) {
        const tokenSpan = document.createElement('span');
        tokenSpan.className = 'wizard-step-selection__value-token';
        tokenSpan.appendChild(this.#createTokenValueItem(token.path, token.value));
        value.appendChild(tokenSpan);
      }
      return value;
    }

    value.appendChild(this.#createSummaryDetails(groups));
    return value;
  }

  #createSummaryDetails(groups: StoryWizardSelectionSummary[]): HTMLDetailsElement {
    const details = cloneTemplate<HTMLDetailsElement>(
      'wizard-value-summary-tmpl',
      '.wizard-step-selection__value-summary',
    );

    details.querySelector('.wizard-step-selection__value-summary-label')!.textContent =
      `${groups.reduce((count, group) => count + group.tokens.length, 0)} technische details`;

    const list = details.querySelector('.wizard-step-selection__value-summary-list')!;

    groups.forEach((group) => {
      group.tokens.forEach((token) => {
        const item = document.createElement('li');
        item.className = 'wizard-step-selection__value-summary-item';
        item.appendChild(this.#createTokenValueItem(token.path, token.value));
        list.appendChild(item);
      });
    });

    return details;
  }

  #createTokenValueItem(path: string, rawValue: string): DocumentFragment {
    const fragment = cloneTemplate('wizard-token-item-tmpl');

    fragment.querySelector('.wizard-step-selection__value-token-path')!.textContent = path;
    fragment.querySelector('.wizard-step-selection__value-token-value')!.textContent = rawValue;

    return fragment;
  }
}
