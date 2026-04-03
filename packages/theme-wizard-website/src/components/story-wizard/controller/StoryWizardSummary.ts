import { dequal } from 'dequal';
import dlv from 'dlv';
import type { StoryWizardStep } from './StoryWizardStep';
import type { StoryWizardTokensDialog } from './StoryWizardTokensDialog';
import type { StoryWizardSelectionSummary, StoryWizardThemeHost } from './types';
import { cloneTemplate } from './cloneTemplate';

export class StoryWizardSummary {
  readonly #listElement: HTMLElement | null;
  readonly #summaryElement: HTMLElement | null;
  readonly #detailsElement: HTMLElement | null;
  readonly #dialog: StoryWizardTokensDialog;
  readonly #onNavigate: (stepIndex: number) => void;

  public constructor(
    root: HTMLElement | Document,
    dialog: StoryWizardTokensDialog,
    onNavigate: (stepIndex: number) => void,
  ) {
    this.#dialog = dialog;
    this.#onNavigate = onNavigate;
    this.#summaryElement = root.querySelector<HTMLElement>('.wizard-step-selections__summary');
    this.#listElement = root.querySelector<HTMLElement>('.wizard-step-selections__list');
    this.#detailsElement = root.querySelector<HTMLElement>('.wizard-step-selections');
  }

  public show() {
    this.#detailsElement?.removeAttribute('hidden');
  }

  public openDetails() {
    const details = this.#detailsElement as HTMLDetailsElement | null;
    if (details) details.open = true;
  }

  public update(steps: StoryWizardStep[], themeHost: StoryWizardThemeHost | null) {
    const listElement = this.#listElement;
    if (!listElement) return;

    listElement.replaceChildren();
    let completedSteps = 0;
    const allSelectedGroups: StoryWizardSelectionSummary[] = [];

    steps.forEach((step, index) => {
      const selectedGroups = step.isAdvanced ? this.getAdvancedSummary(step, themeHost) : step.createSelectionSummary();
      const isCompletedAdvancedStep = step.isAdvanced && step.hasBeenVisited();
      const isConfirmedAdvancedStep = step.isAdvanced && (selectedGroups.length > 0 || isCompletedAdvancedStep);

      const getVisibleGroups = (): StoryWizardSelectionSummary[] => {
        if (!step.isAdvanced) return selectedGroups;
        if (!isConfirmedAdvancedStep) return [];
        if (selectedGroups.length > 0) return selectedGroups;
        return this.getAdvancedSummary(step, themeHost, { includeUnchangedTokens: true });
      };
      const visibleGroups = getVisibleGroups();
      const hasChosenSelection = step.isAdvanced ? isConfirmedAdvancedStep : step.hasChosenSelection();

      if (hasChosenSelection) {
        completedSteps += 1;
        allSelectedGroups.push(...visibleGroups);
      }

      const stepLabel = step.stepLabel || `Stap ${index + 1}`;
      const value = this.#createValueElement(visibleGroups, step.isAdvanced, isConfirmedAdvancedStep);
      const wrapper = this.#createStepWrapper(stepLabel, index, value);

      if (hasChosenSelection) {
        this.#appendTokensButton(wrapper, stepLabel, visibleGroups);
      }

      listElement.appendChild(wrapper);
    });

    this.#appendTotalTokensButton(allSelectedGroups);
    this.#updateCount(completedSteps, steps.length);
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
      const currentValue = theme.at(path)?.$value;
      const defaultValue = this.#getDefaultTokenValue(theme.defaults, path);
      const isChanged = !dequal(currentValue, defaultValue);

      if (isChanged) hasChanges = true;
      if (!includeUnchangedTokens && !isChanged) return [];

      return [{ path, value: this.#formatTokenValue(currentValue) }];
    });

    if (tokens.length === 0) return [];

    return [
      {
        label: step.stepLabel,
        optionLabel: hasChanges ? tokens.map((t) => `${t.path}: ${t.value}`).join(' \u00b7 ') : 'Standaard',
        tokens,
      },
    ];
  }

  #getDefaultTokenValue(defaults: unknown, path: string) {
    const defaultToken = dlv(defaults && typeof defaults === 'object' ? defaults : undefined, path);

    return defaultToken && typeof defaultToken === 'object' && '$value' in (defaultToken as Record<string, unknown>)
      ? (defaultToken as { $value?: unknown }).$value
      : undefined;
  }

  #formatTokenValue(value: unknown) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  #updateCount(completed: number, total: number) {
    if (!this.#summaryElement) return;

    const liveRegion = this.#summaryElement.querySelector('[aria-live]') ?? this.#summaryElement;
    liveRegion.textContent = `Design keuzes (${completed}/${total})`;
  }

  // --- DOM construction (templates for complex structures, createElement for simple ones) ---

  #createStepWrapper(stepLabel: string, index: number, value: HTMLElement): HTMLElement {
    const wrapper = cloneTemplate<HTMLElement>('wizard-step-selection-tmpl', '.wizard-step-selection');

    wrapper.querySelector('.wizard-step-selection__number')!.textContent = String(index + 1);

    const title = wrapper.querySelector<HTMLButtonElement>('.wizard-step-selection__title')!;
    title.textContent = stepLabel;
    title.setAttribute('aria-label', `Ga naar: ${stepLabel}`);
    title.addEventListener('click', () => {
      this.#onNavigate(index);
      const details = this.#detailsElement as HTMLDetailsElement | null;
      if (details) details.open = false;
    });

    wrapper.querySelector('.wizard-step-selection__value')!.replaceWith(value);

    return wrapper;
  }

  #appendTokensButton(wrapper: HTMLElement, stepLabel: string, groups: StoryWizardSelectionSummary[]) {
    wrapper.appendChild(
      this.#createTokensButton('Design tokens', () => this.#dialog.show(stepLabel, groups), {
        ariaLabel: `Design tokens voor: ${stepLabel}`,
      }),
    );
  }

  #appendTotalTokensButton(allGroups: StoryWizardSelectionSummary[]) {
    if (!this.#listElement || allGroups.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'wizard-step-selection wizard-step-selection--total';
    wrapper.appendChild(
      this.#createTokensButton('Alle design tokens', () => this.#dialog.show('Alle design keuzes', allGroups)),
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

  #createValueElement(
    groups: StoryWizardSelectionSummary[],
    isAdvanced: boolean,
    isCompletedAdvancedStep: boolean,
  ): HTMLElement {
    const value = document.createElement('span');
    value.className = 'wizard-step-selection__value';

    if (groups.length === 0) {
      value.textContent =
        isAdvanced && isCompletedAdvancedStep ? 'Standaard' : isAdvanced ? 'Nog niet afgerond' : 'Nog niet gekozen';

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
    const details = cloneTemplate<HTMLDetailsElement>('wizard-value-summary-tmpl', '.wizard-step-selection__value-summary');

    details.querySelector('.wizard-step-selection__value-summary-label')!.textContent =
      `${groups.reduce((count, group) => count + group.tokens.length, 0)} tokens`;

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
