import { dequal } from 'dequal';
import dlv from 'dlv';
import type { StoryWizardStep } from './StoryWizardStep';
import type { StoryWizardTokensDialog } from './StoryWizardTokensDialog';
import type { StoryWizardSelectionSummary, StoryWizardThemeHost } from './types';

export class StoryWizardSummary {
  private readonly listElement: HTMLElement | null;
  private readonly summaryElement: HTMLElement | null;
  private readonly detailsElement: HTMLElement | null;
  private pendingUpdate = false;

  public constructor(
    root: HTMLElement | Document,
    private readonly dialog: StoryWizardTokensDialog,
    private readonly onNavigate: (stepIndex: number) => void,
  ) {
    this.summaryElement = root.querySelector<HTMLElement>('.wizard-step-selections__summary');
    this.listElement = root.querySelector<HTMLElement>('.wizard-step-selections__list');
    this.detailsElement = root.querySelector<HTMLElement>('.wizard-step-selections');
  }

  public show() {
    this.detailsElement?.removeAttribute('hidden');
  }

  public openDetails() {
    const details = this.detailsElement as HTMLDetailsElement | null;
    if (details) details.open = true;
  }

  /** Coalesces multiple rapid calls into a single DOM update. */
  public scheduleUpdate(
    steps: StoryWizardStep[],
    currentStep: number,
    hasFinishedAllChoices: boolean,
    themeHost: StoryWizardThemeHost | null,
  ) {
    if (this.pendingUpdate) return;

    this.pendingUpdate = true;
    queueMicrotask(() => {
      this.pendingUpdate = false;
      this.update(steps, currentStep, hasFinishedAllChoices, themeHost);
    });
  }

  public update(
    steps: StoryWizardStep[],
    currentStep: number,
    hasFinishedAllChoices: boolean,
    themeHost: StoryWizardThemeHost | null,
  ) {
    if (!this.listElement) return;

    this.listElement.replaceChildren();
    let completedSteps = 0;
    const allSelectedGroups: StoryWizardSelectionSummary[] = [];

    steps.forEach((step, index) => {
      const selectedGroups = step.isAdvanced ? this.getAdvancedSummary(step, themeHost) : step.createSelectionSummary();
      const defaultAdvancedGroups =
        step.isAdvanced && step.hasBeenVisited() && selectedGroups.length === 0
          ? this.getAdvancedSummary(step, themeHost, { includeUnchangedTokens: true })
          : [];

      const isCompletedAdvancedStep = step.isAdvanced && step.hasBeenVisited();
      const isConfirmedAdvancedStep = step.isAdvanced && (selectedGroups.length > 0 || isCompletedAdvancedStep);
      const visibleGroups = step.isAdvanced
        ? isConfirmedAdvancedStep
          ? selectedGroups.length > 0
            ? selectedGroups
            : defaultAdvancedGroups
          : []
        : selectedGroups;
      const hasChosenSelection = step.isAdvanced ? isConfirmedAdvancedStep : step.hasChosenSelection();

      if (hasChosenSelection) {
        completedSteps += 1;
      }

      if (hasChosenSelection) {
        allSelectedGroups.push(...visibleGroups);
      }

      const stepLabel = step.stepLabel || `Stap ${index + 1}`;
      const value = this.createValueElement(visibleGroups, step.isAdvanced, isConfirmedAdvancedStep);
      const wrapper = this.createStepWrapper(stepLabel, index, value);

      if (hasChosenSelection) {
        this.appendTokensButton(wrapper, stepLabel, visibleGroups);
      }

      this.listElement!.appendChild(wrapper);
    });

    this.appendTotalTokensButton(allSelectedGroups);
    this.updateCount(completedSteps, steps.length);
  }

  public getAdvancedSummary(
    step: StoryWizardStep,
    themeHost: StoryWizardThemeHost | null,
    options: { includeUnchangedTokens?: boolean } = {},
  ): StoryWizardSelectionSummary[] {
    const theme = themeHost?.theme;
    if (!theme || step.editableTokenPaths.length === 0) return [];

    const { includeUnchangedTokens = false } = options;

    const tokens = step.editableTokenPaths.flatMap((path) => {
      const currentValue = theme.at(path)?.$value;
      const defaultValue = this.getDefaultTokenValue(theme.defaults, path);

      if (!includeUnchangedTokens && dequal(currentValue, defaultValue)) {
        return [];
      }

      return [{ path, value: this.formatTokenValue(currentValue) }];
    });

    if (tokens.length === 0) return [];

    const hasChanges = tokens.some((token) => {
      const currentValue = theme.at(token.path)?.$value;
      const defaultValue = this.getDefaultTokenValue(theme.defaults, token.path);
      return !dequal(currentValue, defaultValue);
    });

    return [
      {
        label: step.stepLabel,
        optionLabel: hasChanges ? tokens.map((t) => `${t.path}: ${t.value}`).join(' \u00b7 ') : 'Standaard',
        tokens,
      },
    ];
  }

  private getDefaultTokenValue(defaults: unknown, path: string) {
    const defaultToken = dlv(defaults && typeof defaults === 'object' ? defaults : undefined, path);

    return defaultToken && typeof defaultToken === 'object' && '$value' in (defaultToken as Record<string, unknown>)
      ? (defaultToken as { $value?: unknown }).$value
      : undefined;
  }

  private formatTokenValue(value: unknown) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  private updateCount(completed: number, total: number) {
    if (!this.summaryElement) return;

    const liveRegion = this.summaryElement.querySelector('[aria-live]') ?? this.summaryElement;
    liveRegion.textContent = `Design keuzes (${completed}/${total})`;
  }

  private createStepWrapper(stepLabel: string, index: number, value: HTMLElement): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'wizard-step-selection';

    const numberBadge = document.createElement('span');
    numberBadge.className = 'wizard-step-selection__number';
    numberBadge.setAttribute('aria-hidden', 'true');
    numberBadge.textContent = String(index + 1);

    const info = document.createElement('span');
    info.className = 'wizard-step-selection__info';

    const title = document.createElement('button');
    title.className = 'wizard-step-selection__title nl-link';
    title.type = 'button';
    title.textContent = stepLabel;
    title.setAttribute('aria-label', `Ga naar: ${stepLabel}`);
    title.addEventListener('click', () => {
      this.onNavigate(index);
      const details = this.detailsElement as HTMLDetailsElement | null;
      if (details) details.open = false;
    });

    info.appendChild(title);
    info.appendChild(value);
    wrapper.appendChild(numberBadge);
    wrapper.appendChild(info);

    return wrapper;
  }

  private appendTokensButton(wrapper: HTMLElement, stepLabel: string, groups: StoryWizardSelectionSummary[]) {
    wrapper.appendChild(
      this.createTokensButton('Design tokens', () => this.dialog.show(stepLabel, groups), {
        ariaLabel: `Design tokens voor: ${stepLabel}`,
      }),
    );
  }

  private appendTotalTokensButton(allGroups: StoryWizardSelectionSummary[]) {
    if (!this.listElement || allGroups.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'wizard-step-selection wizard-step-selection--total';
    wrapper.appendChild(
      this.createTokensButton('Alle design tokens', () => this.dialog.show('Alle design keuzes', allGroups)),
    );

    this.listElement.appendChild(wrapper);
  }

  private createTokensButton(label: string, onClick: () => void, options: { ariaLabel?: string } = {}) {
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

  private createValueElement(
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

    if (groups.length === 1 && groups[0].optionLabel) {
      const option = document.createElement('span');
      option.className = 'wizard-step-selection__value-option';
      option.textContent = groups[0].optionLabel;
      value.appendChild(option);
    }

    if (groups.length === 1 && groups[0].tokens.length <= 1) {
      const token = groups[0].tokens[0];

      if (token) {
        const tokenValue = document.createElement('span');
        tokenValue.className = 'wizard-step-selection__value-token';
        tokenValue.appendChild(this.createTokenValueItem(token.path, token.value));
        value.appendChild(tokenValue);
      } else {
        value.textContent = groups[0].optionLabel;
      }

      return value;
    }

    const details = document.createElement('details');
    details.className = 'wizard-step-selection__value-summary';

    const summary = document.createElement('summary');
    summary.className = 'wizard-step-selection__value-summary-label';
    summary.textContent = `${groups.reduce((count, group) => count + group.tokens.length, 0)} tokens`;

    const list = document.createElement('ul');
    list.className = 'wizard-step-selection__value-summary-list';

    groups.forEach((group) => {
      group.tokens.forEach((token) => {
        const item = document.createElement('li');
        item.className = 'wizard-step-selection__value-summary-item';
        item.appendChild(this.createTokenValueItem(token.path, token.value));
        list.appendChild(item);
      });
    });

    details.appendChild(summary);
    details.appendChild(list);
    value.appendChild(details);

    return value;
  }

  private createTokenValueItem(path: string, rawValue: string): DocumentFragment {
    const fragment = document.createDocumentFragment();

    const tokenPath = document.createElement('code');
    tokenPath.className = 'wizard-step-selection__value-token-path';
    tokenPath.textContent = path;

    const separator = document.createElement('span');
    separator.className = 'wizard-step-selection__value-token-separator';
    separator.textContent = ':';

    const tokenValue = document.createElement('code');
    tokenValue.className = 'wizard-step-selection__value-token-value';
    tokenValue.textContent = rawValue;

    fragment.appendChild(tokenPath);
    fragment.appendChild(separator);
    fragment.appendChild(tokenValue);

    return fragment;
  }
}
