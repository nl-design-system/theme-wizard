import type { components } from '@/lib/components';
import type { StoryWizardSelectionSummary } from './types';
import { initStories } from '@/components/render-stories';
import { flattenDesignTokens } from './flatten-design-tokens';
import { StoryWizardStep } from './StoryWizardStep';

export class StoryWizardController {
  private readonly componentId: keyof typeof components;
  private currentStep = 0;
  private readonly indicators: HTMLElement[];
  private readonly nextBtns: HTMLButtonElement[];
  private readonly prevBtns: HTMLButtonElement[];
  private readonly resetBtns: HTMLButtonElement[];
  private readonly selectedValues: HTMLElement | null;
  private readonly stepSelections: HTMLElement | null;
  private readonly stepSelectionsList: HTMLElement | null;
  private readonly stepSelectionsSummary: HTMLElement | null;
  private readonly steps: StoryWizardStep[];
  private readonly steppers: HTMLElement[];
  private readonly storageKey: string;
  private tokensDialog: HTMLDialogElement | null = null;

  public constructor(private readonly container: HTMLElement) {
    this.componentId = container.dataset.componentId as keyof typeof components;
    const root = container.parentElement ?? document;
    this.steps = Array.from(root.querySelectorAll<HTMLElement>('.wizard-story-section')).map(
      (element) => new StoryWizardStep(element),
    );
    this.steppers = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-stepper'));
    this.resetBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-reset'));
    this.prevBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-prev'));
    this.nextBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.wizard-preset-next'));
    this.indicators = Array.from(root.querySelectorAll<HTMLElement>('.wizard-preset-step-indicator'));
    this.selectedValues = root.querySelector<HTMLElement>('.wizard-selected-values');
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

    this.selectedValues?.removeAttribute('hidden');
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

    this.nextBtns.forEach((nextBtn) => {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.total - 1) {
          this.showStep(this.currentStep + 1);
        }
      });
    });
  }

  private bindOptionListeners() {
    this.steps.forEach((step) => {
      step.bindOptions(() => {
        this.writeStoredState();
        this.getCurrentStep()?.applyPreviewStyle();
        this.updateStepSelections();
        this.updateSelectedValues();
        this.updateNextButtonState();
      });
    });
  }

  private getCurrentStep() {
    return this.steps[this.currentStep];
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

    this.nextBtns.forEach((nextBtn) => {
      nextBtn.disabled = !isComplete;
      nextBtn.classList.toggle('nl-button--disabled', !isComplete);
      nextBtn.textContent = isLastStep ? 'Afronden' : 'Volgende';
    });
  }

  private updateSelectedValues() {
    if (!this.selectedValues) return;

    const labels = this.getCurrentStep()?.getSelectionLabels() ?? [];
    this.selectedValues.textContent = labels.length > 0 ? labels.join(' • ') : 'Nog geen preset gekozen.';
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
      const selectedGroups = step.createSelectionSummary(flattenDesignTokens);
      const hasSelection = selectedGroups.length > 0;
      if (hasSelection) {
        completedSteps += 1;
        allSelectedGroups.push(...selectedGroups);
      }

      const wrapper = document.createElement('div');
      wrapper.className = `wizard-step-selection${hasSelection ? '' : ' wizard-step-selection--empty'}`;

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

      const value = document.createElement('span');
      value.className = 'wizard-step-selection__value';

      if (hasSelection) {
        value.textContent = selectedGroups.map((g) => g.optionLabel).join(' · ');
      } else {
        value.textContent = 'Nog niet gekozen';
        value.classList.add('wizard-step-selection__value--empty');
      }

      info.appendChild(title);
      info.appendChild(value);

      wrapper.appendChild(numberBadge);
      wrapper.appendChild(info);

      if (hasSelection) {
        const tokensBtn = document.createElement('button');
        tokensBtn.className = 'wizard-step-selection__tokens-btn nl-button nl-button--subtle';
        tokensBtn.type = 'button';
        tokensBtn.setAttribute('aria-label', `Design tokens voor: ${step.stepLabel || `Stap ${index + 1}`}`);
        tokensBtn.textContent = 'Design tokens';
        tokensBtn.addEventListener('click', () => this.showTokensDialog(step.stepLabel, selectedGroups));
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

  private showStep(index: number) {
    this.steps.forEach((step, stepIndex) => {
      if (stepIndex === index) {
        step.show();
      } else {
        step.hide();
      }
    });

    this.currentStep = index;
    this.indicators.forEach((indicator) => {
      indicator.textContent = `Stap ${index + 1} van ${this.total}`;
    });
    this.prevBtns.forEach((prevBtn) => {
      prevBtn.disabled = index === 0;
      prevBtn.classList.toggle('nl-button--disabled', index === 0);
    });
    this.updateStepSelections();
    this.updateSelectedValues();
    this.updateNextButtonState();
    this.getCurrentStep()?.applyPreviewStyle();
    this.writeStoredState();
  }

  private reset() {
    this.clearSelections();
    this.clearStoredState();
    this.showStep(0);
  }
}
