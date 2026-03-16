import { dequal } from 'dequal';
import type { components } from '@/lib/components';
import { initStories } from '@/components/render-stories';
import type { StoryWizardSelectionSummary } from './types';
import { flattenDesignTokens } from './flatten-design-tokens';
import { StoryWizardStep } from './StoryWizardStep';

export class StoryWizardController {
  private readonly componentId: keyof typeof components;
  private currentStep = 0;
  private hasFinishedAllChoices = false;
  private readonly finishSafeBtns: HTMLButtonElement[];
  private readonly nextBtns: HTMLButtonElement[];
  private readonly prevBtns: HTMLButtonElement[];
  private readonly resetBtns: HTMLButtonElement[];
  private readonly transitionNotes: HTMLElement[];
  private readonly stepSelections: HTMLElement | null;
  private readonly stepSelectionsList: HTMLElement | null;
  private readonly stepSelectionsSummary: HTMLElement | null;
  private readonly steps: StoryWizardStep[];
  private readonly steppers: HTMLElement[];
  private readonly storageKey: string;
  private tokensDialog: HTMLDialogElement | null = null;

  public constructor(private readonly container: HTMLElement) {
    this.componentId = container.dataset.componentId as keyof typeof components;
    const root = container.closest<HTMLElement>('[data-story-wizard-root]') ?? container.parentElement ?? document;
    const shell = container.closest<HTMLElement>('.wizard-main') ?? root;
    this.steps = Array.from(root.querySelectorAll<HTMLElement>('.wizard-story-section')).map(
      (element) => new StoryWizardStep(element),
    );
    this.steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.finishSafeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-finish-safe'));
    this.resetBtns = Array.from(shell.querySelectorAll<HTMLButtonElement>('.wizard-preset-reset'));
    this.prevBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-prev'));
    this.nextBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-next'));
    this.transitionNotes = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-transition-note'));
    this.stepSelectionsSummary = root.querySelector<HTMLElement>('.wizard-step-selections__summary');
    this.stepSelectionsList = root.querySelector<HTMLElement>('.wizard-step-selections__list');
    this.stepSelections = root.querySelector<HTMLElement>('.wizard-step-selections');
    this.storageKey = `theme-wizard:${this.componentId}:preset-state`;
  }

  public static init() {
    const container = document.getElementById('story-wizard');
    if (!container) return;

    new StoryWizardController(container).start();
  }

  private get total() {
    return this.steps.length;
  }

  private start() {
    initStories(this.componentId, JSON.parse(this.container.dataset.storyIds || '[]'));
    this.bindOptionListeners();
    this.bindNavigation();

    if (this.total === 0) {
      this.steppers.forEach((stepper) => stepper.setAttribute('hidden', ''));
      return;
    }

    this.stepSelections?.removeAttribute('hidden');
    this.steppers.forEach((stepper) => stepper.removeAttribute('hidden'));
    this.showStep(this.restoreStoredState());
  }

  private bindNavigation() {
    this.resetBtns.forEach((resetBtn) => {
      resetBtn.addEventListener('click', () => {
        this.reset();
      });
    });

    this.prevBtns.forEach((prevBtn) => {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 0) this.showStep(this.currentStep - 1);
      });
    });

    this.finishSafeBtns.forEach((finishBtn) => {
      finishBtn.addEventListener('click', () => {
        this.finishWithSafeChoices();
      });
    });

    this.nextBtns.forEach((nextBtn) => {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep === this.total - 1) {
          this.finishWithAllChoices();
        } else {
          this.showStep(this.currentStep + 1);
        }
      });
    });
  }

  private bindOptionListeners() {
    this.steps.forEach((step) => {
      step.bindOptions(() => {
        this.writeStoredState();
        this.applyPreviewStyles();
        this.updateStepSelections();
        this.updateNextButtonState();
      });
    });
  }

  private getCurrentStep() {
    return this.steps[this.currentStep];
  }

  private getMergedPreviewStyle() {
    return this.steps
      .map((step) => step.getPreviewStyle())
      .filter(Boolean)
      .join(';');
  }

  private applyPreviewStyles() {
    const previewStyle = this.getMergedPreviewStyle();

    this.steps.forEach((step) => {
      step.element
        .querySelectorAll<HTMLElement>('.wizard-story-section__variants wizard-preview-theme')
        .forEach((preview) => {
          if (previewStyle) {
            preview.setAttribute('style', previewStyle);
          } else {
            preview.removeAttribute('style');
          }
        });
    });
  }

  private readStoredState() {
    try {
      const raw = globalThis.localStorage?.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private writeStoredState() {
    try {
      const state = {
        currentStep: this.currentStep,
        sections: this.steps.map((step) => step.getStoredSelection()),
      };

      globalThis.localStorage?.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      // Progressive enhancement: ignore storage failures and keep the wizard usable.
    }
  }

  private clearStoredState() {
    try {
      globalThis.localStorage?.removeItem(this.storageKey);
    } catch {
      // Progressive enhancement: ignore storage failures and keep the wizard usable.
    }
  }

  private clearSelections() {
    this.steps.forEach((step) => {
      step.groups.forEach((group) => {
        group.options.forEach((option) => {
          option.setChecked(false);
        });
      });
    });
  }

  private restoreStoredState() {
    const storedState = this.readStoredState();
    if (!storedState) return 0;

    storedState.sections?.forEach((selection: number[], index: number) => {
      this.steps[index]?.restoreStoredSelection(selection);
    });

    if (
      typeof storedState.currentStep === 'number' &&
      storedState.currentStep >= 0 &&
      storedState.currentStep < this.total
    ) {
      return storedState.currentStep;
    }

    return 0;
  }

  private updateNextButtonState() {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    const isComplete = currentStep.hasRequiredSelections();
    const isLastStep = this.currentStep === this.total - 1;
    const lastSafeStepIndex = this.getLastSafeStepIndex();
    const isLastSafeStep = lastSafeStepIndex >= 0 && this.currentStep === lastSafeStepIndex && this.hasAdvancedSteps();
    const showSafeFinish = isLastSafeStep && isComplete;

    this.nextBtns.forEach((nextBtn) => {
      nextBtn.disabled = !isComplete;
      nextBtn.classList.toggle('nl-button--disabled', !isComplete);
      nextBtn.textContent = isLastStep ? 'Afronden' : isLastSafeStep ? 'Geavanceerd' : 'Volgende';
      nextBtn.classList.toggle('nl-button--primary', !isLastSafeStep || isLastStep);
      nextBtn.classList.toggle('nl-button--subtle', isLastSafeStep && !isLastStep);
    });

    this.finishSafeBtns.forEach((finishBtn) => {
      finishBtn.hidden = !showSafeFinish;
    });

    this.transitionNotes.forEach((note) => {
      note.hidden = !isLastSafeStep;
      note.textContent = isLastSafeStep
        ? 'Je kunt nu afronden of doorgaan naar geavanceerde instellingen.'
        : '';
    });
  }

  private hasAdvancedSteps() {
    return this.steps.some((step) => step.isAdvanced);
  }

  private getFirstAdvancedStepIndex() {
    return this.steps.findIndex((step) => step.isAdvanced);
  }

  private getLastSafeStepIndex() {
    const firstAdvancedIndex = this.getFirstAdvancedStepIndex();
    if (firstAdvancedIndex === 0) {
      return -1;
    }

    return firstAdvancedIndex > 0 ? firstAdvancedIndex - 1 : this.total - 1;
  }

  private getTheme() {
    return this.container.closest('theme-wizard-app') as
      | ({
          theme?: {
            at: (path: string) => { $value?: unknown } | undefined;
            defaults?: unknown;
          };
        } & HTMLElement)
      | null;
  }

  private formatTokenValue(value: unknown) {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }

  private getAdvancedSelectionSummary(
    step: StoryWizardStep,
    options: { includeUnchangedTokens?: boolean } = {},
  ): StoryWizardSelectionSummary[] {
    const themeHost = this.getTheme();
    const theme = themeHost?.theme;
    if (!theme || step.editableTokenPaths.length === 0) return [];

    const { includeUnchangedTokens = false } = options;

    const tokens = step.editableTokenPaths.flatMap((path) => {
      const currentToken = theme.at(path);
      const defaultToken = theme.defaults && typeof theme.defaults === 'object'
        ? path.split('.').reduce<unknown>((token, key) => {
            if (!token || typeof token !== 'object') return undefined;
            return (token as Record<string, unknown>)[key];
          }, theme.defaults)
        : undefined;

      const currentValue = currentToken?.$value;
      const defaultValue =
        defaultToken && typeof defaultToken === 'object' && '$value' in (defaultToken as Record<string, unknown>)
          ? (defaultToken as { $value?: unknown }).$value
          : undefined;

      if (!includeUnchangedTokens && dequal(currentValue, defaultValue)) {
        return [];
      }

      return [
        {
          path,
          value: this.formatTokenValue(currentValue),
        },
      ];
    });

    if (tokens.length === 0) {
      return [];
    }

    const hasChanges = tokens.some((token) => {
      const currentToken = theme.at(token.path);
      const defaultToken = theme.defaults && typeof theme.defaults === 'object'
        ? token.path.split('.').reduce<unknown>((value, key) => {
            if (!value || typeof value !== 'object') return undefined;
            return (value as Record<string, unknown>)[key];
          }, theme.defaults)
        : undefined;

      const currentValue = currentToken?.$value;
      const defaultValue =
        defaultToken && typeof defaultToken === 'object' && '$value' in (defaultToken as Record<string, unknown>)
          ? (defaultToken as { $value?: unknown }).$value
          : undefined;

      return !dequal(currentValue, defaultValue);
    });

    return [
      {
        label: step.stepLabel,
        optionLabel: hasChanges
          ? tokens.map((token) => `${token.path}: ${token.value}`).join(' · ')
          : 'Standaard',
        tokens,
      },
    ];
  }

  private getAllSelectionGroups(includeAdvancedDefaults = false) {
    return this.steps.flatMap((step) => {
      if (step.isAdvanced) {
        return this.getAdvancedSelectionSummary(step, { includeUnchangedTokens: includeAdvancedDefaults });
      }

      return step.createSelectionSummary(flattenDesignTokens);
    });
  }

  private finishWithSafeChoices() {
    const lastSafeStepIndex = this.getLastSafeStepIndex();
    const safeSteps = this.steps.slice(0, Math.max(lastSafeStepIndex + 1, 0));
    const selectedGroups = safeSteps.flatMap((step) => step.createSelectionSummary(flattenDesignTokens));
    if (selectedGroups.length === 0) return;

    this.showTokensDialog('Veilige keuzes', selectedGroups);
    const details = this.stepSelections as HTMLDetailsElement | null;
    if (details) details.open = true;
  }

  private finishWithAllChoices() {
    const selectedGroups = this.getAllSelectionGroups(true);
    if (selectedGroups.length === 0) return;

    this.hasFinishedAllChoices = true;
    this.updateStepSelections();
    this.showTokensDialog('Alle design keuzes', selectedGroups);
    const details = this.stepSelections as HTMLDetailsElement | null;
    if (details) details.open = true;
  }

  private getOrCreateTokensDialog(): HTMLDialogElement {
    if (this.tokensDialog) return this.tokensDialog;

    const dialog = document.createElement('dialog');
    dialog.className = 'wizard-tokens-dialog';
    dialog.innerHTML = `
      <div class="wizard-tokens-dialog__inner">
        <div class="wizard-tokens-dialog__header">
          <h2 class="wizard-tokens-dialog__title"></h2>
          <button class="wizard-tokens-dialog__close nl-button nl-button--subtle" type="button" aria-label="Sluiten">✕</button>
        </div>
        <div class="wizard-tokens-dialog__body"></div>
      </div>
    `;

    dialog.querySelector('.wizard-tokens-dialog__close')!.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    (document.querySelector('theme-wizard-app') ?? document.body).appendChild(dialog);
    this.tokensDialog = dialog;
    return dialog;
  }

  private showTokensDialog(stepTitle: string, groups: StoryWizardSelectionSummary[]) {
    const dialog = this.getOrCreateTokensDialog();

    const titleEl = dialog.querySelector('.wizard-tokens-dialog__title')!;
    titleEl.textContent = stepTitle;

    const body = dialog.querySelector('.wizard-tokens-dialog__body')!;
    body.replaceChildren();

    groups.forEach((group) => {
      const section = document.createElement('section');
      section.className = 'wizard-tokens-dialog__group';

      const groupTitle = document.createElement('h3');
      groupTitle.className = 'wizard-tokens-dialog__group-title';
      groupTitle.textContent = group.label ? `${group.label}: ${group.optionLabel}` : group.optionLabel;
      section.appendChild(groupTitle);

      const table = document.createElement('table');
      table.className = 'wizard-tokens-dialog__table';

      group.tokens.forEach((token) => {
        const row = document.createElement('tr');

        const pathCell = document.createElement('td');
        pathCell.className = 'wizard-tokens-dialog__token-path';
        pathCell.textContent = token.path;

        const valueCell = document.createElement('td');
        valueCell.className = 'wizard-tokens-dialog__token-value';
        valueCell.textContent = token.value;

        row.appendChild(pathCell);
        row.appendChild(valueCell);
        table.appendChild(row);
      });

      section.appendChild(table);
      body.appendChild(section);
    });

    dialog.showModal();
  }

  private updateStepSelections() {
    if (!this.stepSelectionsList) return;

    this.stepSelectionsList.replaceChildren();
    let completedSteps = 0;
    const allSelectedGroups: StoryWizardSelectionSummary[] = [];

    this.steps.forEach((step, index) => {
      const selectedGroups = step.isAdvanced
        ? this.getAdvancedSelectionSummary(step)
        : step.createSelectionSummary(flattenDesignTokens);
      const isCompletedAdvancedStep =
        step.isAdvanced && (index < this.currentStep || (index === this.currentStep && this.hasFinishedAllChoices));
      const hasSelection = selectedGroups.length > 0;
      if (hasSelection || isCompletedAdvancedStep) {
        completedSteps += 1;
      }

      if (hasSelection) {
        allSelectedGroups.push(...selectedGroups);
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'wizard-step-selection';

      const numberBadge = document.createElement('span');
      numberBadge.className = 'wizard-step-selection__number';
      numberBadge.setAttribute('aria-hidden', 'true');
      numberBadge.textContent = String(index + 1);

      const info = document.createElement('span');
      info.className = 'wizard-step-selection__info';

      const stepLabel = step.stepLabel || `Stap ${index + 1}`;
      const title = document.createElement('button');
      title.className = 'wizard-step-selection__title nl-link';
      title.type = 'button';
      title.textContent = stepLabel;
      title.setAttribute('aria-label', `Ga naar: ${stepLabel}`);
      title.addEventListener('click', () => {
        this.showStep(index);
        const details = this.stepSelections as HTMLDetailsElement | null;
        if (details) details.open = false;
      });

      const value = this.createStepSelectionValue(selectedGroups, step.isAdvanced, isCompletedAdvancedStep);

      info.appendChild(title);
      info.appendChild(value);

      wrapper.appendChild(numberBadge);
      wrapper.appendChild(info);

      if (hasSelection) {
        const tokensBtn = document.createElement('button');
        tokensBtn.className = 'wizard-step-selection__tokens-btn nl-button nl-button--subtle';
        tokensBtn.type = 'button';
        tokensBtn.setAttribute('aria-label', `Design tokens voor: ${stepLabel}`);
        tokensBtn.textContent = 'Design tokens';
        tokensBtn.addEventListener('click', () => this.showTokensDialog(stepLabel, selectedGroups));
        wrapper.appendChild(tokensBtn);
      }

      this.stepSelectionsList?.appendChild(wrapper);
    });

    if (allSelectedGroups.length > 0) {
      const totalWrapper = document.createElement('div');
      totalWrapper.className = 'wizard-step-selection wizard-step-selection--total';

      const totalTokensBtn = document.createElement('button');
      totalTokensBtn.className = 'wizard-step-selection__tokens-btn nl-button nl-button--subtle';
      totalTokensBtn.type = 'button';
      totalTokensBtn.textContent = 'Alle design tokens';
      totalTokensBtn.addEventListener('click', () => this.showTokensDialog('Alle design keuzes', allSelectedGroups));
      totalWrapper.appendChild(totalTokensBtn);

      this.stepSelectionsList?.appendChild(totalWrapper);
    }

    if (this.stepSelectionsSummary) {
      const liveRegion = this.stepSelectionsSummary.querySelector('[aria-live]') ?? this.stepSelectionsSummary;
      liveRegion.textContent = `Design keuzes (${completedSteps}/${this.total})`;
    }
  }

  private createStepSelectionValue(
    selectedGroups: StoryWizardSelectionSummary[],
    isAdvanced: boolean,
    isCompletedAdvancedStep: boolean,
  ) {
    const value = document.createElement('span');
    value.className = 'wizard-step-selection__value';

    if (selectedGroups.length === 0) {
      value.textContent = isAdvanced && isCompletedAdvancedStep ? 'Standaard' : isAdvanced ? 'Nog niet afgerond' : 'Nog niet gekozen';

      if (!isAdvanced || !isCompletedAdvancedStep) {
        value.classList.add('wizard-step-selection__value--empty');
      }

      return value;
    }

    if (selectedGroups.length === 1 && selectedGroups[0].tokens.length <= 1) {
      const token = selectedGroups[0].tokens[0];

      if (token) {
        value.appendChild(this.createTokenValueItem(token.path, token.value));
      } else {
        value.textContent = selectedGroups[0].optionLabel;
      }

      return value;
    }

    const details = document.createElement('details');
    details.className = 'wizard-step-selection__value-summary';

    const summary = document.createElement('summary');
    summary.className = 'wizard-step-selection__value-summary-label';
    summary.textContent = `${selectedGroups.reduce((count, group) => count + group.tokens.length, 0)} tokens`;

    const list = document.createElement('ul');
    list.className = 'wizard-step-selection__value-summary-list';

    selectedGroups.forEach((group) => {
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

  private createTokenValueItem(path: string, rawValue: string) {
    const fragment = document.createDocumentFragment();

    const tokenPath = document.createElement('code');
    tokenPath.className = 'wizard-step-selection__value-token-path';
    tokenPath.textContent = path;

    const separator = document.createElement('span');
    separator.className = 'wizard-step-selection__value-token-separator';
    separator.textContent = ':';

    const tokenValue = document.createElement('code');
    tokenValue.className = 'wizard-step-selection__value-token-value';
    tokenValue.textContent = rawValue.replaceAll('"', '');

    fragment.appendChild(tokenPath);
    fragment.appendChild(separator);
    fragment.appendChild(tokenValue);

    return fragment;
  }

  private showStep(index: number) {
    if (index !== this.total - 1) {
      this.hasFinishedAllChoices = false;
    }

    this.steps.forEach((step, stepIndex) => {
      if (stepIndex === index) {
        step.show();
      } else {
        step.hide();
      }
    });

    this.currentStep = index;
    this.prevBtns.forEach((prevBtn) => {
      prevBtn.disabled = index === 0;
      prevBtn.classList.toggle('nl-button--disabled', index === 0);
    });
    this.updateStepSelections();
    this.updateNextButtonState();
    this.applyPreviewStyles();
    this.writeStoredState();
  }

  private reset() {
    this.hasFinishedAllChoices = false;
    this.container
      .closest('theme-wizard-app')
      ?.dispatchEvent(new Event('reset', { bubbles: true, composed: true }));
    this.clearSelections();
    this.clearStoredState();
    this.showStep(0);
  }
}
