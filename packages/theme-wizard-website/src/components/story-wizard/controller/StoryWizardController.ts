import type { components } from '@/lib/components';
import { initStories } from '@/components/render-stories';
import { flattenDesignTokens } from './flatten-design-tokens';
import { StoryWizardStep } from './StoryWizardStep';

export class StoryWizardController {
  private readonly componentId: keyof typeof components;
  private currentStep = 0;
  private readonly indicator: HTMLElement | null;
  private readonly nextBtn: HTMLButtonElement | null;
  private readonly prevBtn: HTMLButtonElement | null;
  private readonly resetBtn: HTMLButtonElement | null;
  private readonly selectedValues: HTMLElement | null;
  private readonly stepSelections: HTMLElement | null;
  private readonly stepSelectionsList: HTMLElement | null;
  private readonly stepSelectionsSummary: HTMLElement | null;
  private readonly steps: StoryWizardStep[];
  private readonly stepper: HTMLElement | null;
  private readonly storageKey: string;

  public constructor(private readonly container: HTMLElement) {
    this.componentId = container.dataset.componentId as keyof typeof components;
    const root = container.parentElement ?? document;
    this.steps = Array.from(root.querySelectorAll<HTMLElement>('.wizard-story-section')).map(
      (element) => new StoryWizardStep(element),
    );
    this.stepper = root.querySelector<HTMLElement>('.wizard-preset-stepper');
    this.resetBtn = root.querySelector<HTMLButtonElement>('.wizard-preset-reset');
    this.prevBtn = root.querySelector<HTMLButtonElement>('.wizard-preset-prev');
    this.nextBtn = root.querySelector<HTMLButtonElement>('.wizard-preset-next');
    this.indicator = root.querySelector<HTMLElement>('.wizard-preset-step-indicator');
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
      this.stepper?.setAttribute('hidden', '');
      return;
    }

    this.selectedValues?.removeAttribute('hidden');
    this.stepSelections?.removeAttribute('hidden');
    this.stepper?.removeAttribute('hidden');
    this.showStep(this.restoreStoredState());
  }

  private bindNavigation() {
    this.resetBtn?.addEventListener('click', () => {
      this.reset();
    });

    this.prevBtn?.addEventListener('click', () => {
      if (this.currentStep > 0) this.showStep(this.currentStep - 1);
    });

    this.nextBtn?.addEventListener('click', () => {
      if (this.currentStep < this.total - 1) {
        this.showStep(this.currentStep + 1);
      }
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
    if (!this.nextBtn) return;

    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    const isComplete = currentStep.hasRequiredSelections();
    const isLastStep = this.currentStep === this.total - 1;
    this.nextBtn.disabled = !isComplete;
    this.nextBtn.classList.toggle('nl-button--disabled', !isComplete);
    this.nextBtn.textContent = isLastStep ? 'Afronden' : 'Volgende';
  }

  private updateSelectedValues() {
    if (!this.selectedValues) return;

    const labels = this.getCurrentStep()?.getSelectionLabels() ?? [];
    this.selectedValues.textContent = labels.length > 0 ? labels.join(' • ') : 'Nog geen preset gekozen.';
  }

  private updateStepSelections() {
    if (!this.stepSelectionsList) return;

    this.stepSelectionsList.replaceChildren();
    let completedSteps = 0;

    this.steps.forEach((step, index) => {
      const wrapper = document.createElement('section');
      wrapper.className = 'wizard-step-selection';

      const header = document.createElement('div');
      header.className = 'wizard-step-selection__header';

      const title = document.createElement('p');
      title.className = 'wizard-step-selection__title';
      title.textContent = `Stap ${index + 1}: ${step.stepLabel || `Stap ${index + 1}`}`;

      const selections = step.getSelectionLabels();
      const selectedGroups = step.createSelectionSummary(flattenDesignTokens);

      header.appendChild(title);
      wrapper.appendChild(header);

      if (selectedGroups.length > 0) {
        if (selections.length > 0) completedSteps += 1;

        selectedGroups.forEach((group) => {
          const groupBlock = document.createElement('div');
          groupBlock.className = 'wizard-step-selection__group';

          const groupTitle = document.createElement('p');
          groupTitle.className = 'wizard-step-selection__group-title';
          groupTitle.textContent = group.label ? `${group.label}: ${group.optionLabel}` : group.optionLabel;
          groupBlock.appendChild(groupTitle);

          const tokenList = document.createElement('ul');
          tokenList.className = 'wizard-step-selection__tokens';

          group.tokens.forEach((token) => {
            const item = document.createElement('li');
            item.className = 'wizard-step-selection__token';

            const tokenText = document.createElement('code');
            tokenText.className = 'wizard-step-selection__token-text';
            tokenText.textContent = `${token.path}: ${token.value}`;

            item.appendChild(tokenText);
            tokenList.appendChild(item);
          });

          groupBlock.appendChild(tokenList);
          wrapper.appendChild(groupBlock);
        });
      } else {
        const summary = document.createElement('p');
        summary.className = 'wizard-step-selection__summary';
        summary.textContent = 'Nog geen preset gekozen.';
        wrapper.appendChild(summary);
      }

      this.stepSelectionsList?.appendChild(wrapper);
    });

    if (this.stepSelectionsSummary) {
      this.stepSelectionsSummary.textContent = `Gekozen presets per stap (${completedSteps}/${this.total})`;
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
    if (this.indicator) this.indicator.textContent = `Stap ${index + 1} van ${this.total}`;
    if (this.prevBtn) this.prevBtn.disabled = index === 0;
    this.prevBtn?.classList.toggle('nl-button--disabled', index === 0);
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
