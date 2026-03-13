import type { components } from '@/lib/components';
import { initStories } from '@/components/render-stories';

type WizardTokenPresetInput = HTMLInputElement;
type DesignTokenLeaf = { path: string; value: string };

class StoryWizardOption {
  public constructor(public readonly input: WizardTokenPresetInput) {}

  public get isChecked() {
    return this.input.checked;
  }

  public get optionLabel() {
    return this.input.dataset.optionLabel?.trim() ?? '';
  }

  public get previewStyle() {
    return this.input.dataset.previewStyle ?? '';
  }

  public get tokens() {
    try {
      return JSON.parse(this.input.dataset.tokens || '{}');
    } catch {
      return {};
    }
  }

  public setChecked(isChecked: boolean) {
    this.input.checked = isChecked;
  }

  public bindChange(listener: () => void) {
    this.input.addEventListener('change', listener);
  }
}

class StoryWizardGroup {
  public readonly options: StoryWizardOption[];

  public constructor(public readonly element: HTMLElement) {
    this.options = Array.from(element.querySelectorAll<WizardTokenPresetInput>('.wizard-token-preset__input')).map(
      (input) => new StoryWizardOption(input),
    );
  }

  public get groupLabel() {
    return this.element.dataset.groupLabel?.trim() ?? '';
  }

  public getSelectedOption() {
    return this.options.find((option) => option.isChecked);
  }

  public getSelectedIndex() {
    return this.options.findIndex((option) => option.isChecked);
  }

  public hasSelection() {
    return this.getSelectedIndex() >= 0;
  }

  public restoreSelectedIndex(index: number) {
    if (index < 0) return;

    this.options.forEach((option, optionIndex) => {
      option.setChecked(optionIndex === index);
    });
  }

  public bindOptions(listener: () => void) {
    this.options.forEach((option) => option.bindChange(listener));
  }

  public getSelectionLabel() {
    const selectedOption = this.getSelectedOption();
    if (!selectedOption) return '';
    if (!this.groupLabel || !selectedOption.optionLabel) return '';

    return `${this.groupLabel}: ${selectedOption.optionLabel}`;
  }
}

class StoryWizardStep {
  public readonly groups: StoryWizardGroup[];

  public constructor(public readonly element: HTMLElement) {
    this.groups = Array.from(element.querySelectorAll<HTMLElement>('[data-preset-group]')).map(
      (group) => new StoryWizardGroup(group),
    );
  }

  public get stepLabel() {
    return this.element.dataset.stepLabel || '';
  }

  public hide() {
    this.element.hidden = true;
  }

  public show() {
    this.element.hidden = false;
  }

  public bindOptions(listener: () => void) {
    this.groups.forEach((group) => group.bindOptions(listener));
  }

  public getStoredSelection() {
    return this.groups.map((group) => group.getSelectedIndex());
  }

  public restoreStoredSelection(selection: number[]) {
    this.groups.forEach((group, groupIndex) => {
      const selectedIndex = selection?.[groupIndex];
      if (typeof selectedIndex !== 'number') return;
      group.restoreSelectedIndex(selectedIndex);
    });
  }

  public hasRequiredSelections() {
    return this.groups.every((group) => group.hasSelection());
  }

  public getSelectionLabels() {
    return this.groups.flatMap((group) => {
      const label = group.getSelectionLabel();
      return label ? [label] : [];
    });
  }

  public getPreviewStyle() {
    return this.groups
      .map((group) => group.getSelectedOption()?.previewStyle || '')
      .filter(Boolean)
      .join(';');
  }

  public applyPreviewStyle() {
    const previewStyle = this.getPreviewStyle();

    this.element
      .querySelectorAll<HTMLElement>('.wizard-story-section__variants wizard-preview-theme')
      .forEach((preview) => {
        if (previewStyle) {
          preview.setAttribute('style', previewStyle);
        } else {
          preview.removeAttribute('style');
        }
      });
  }

  public createSelectionSummary(flattenDesignTokens: (tokens: unknown, path?: string[]) => DesignTokenLeaf[]) {
    return this.groups.flatMap((group) => {
      const option = group.getSelectedOption();
      if (!option) return [];

      return [
        {
          label: group.groupLabel,
          optionLabel: option.optionLabel,
          tokens: flattenDesignTokens(option.tokens),
        },
      ];
    });
  }
}

class StoryWizardController {
  private readonly componentId: keyof typeof components;
  private currentStep = 0;
  private readonly indicator: HTMLElement | null;
  private readonly nextBtn: HTMLButtonElement | null;
  private readonly prevBtn: HTMLButtonElement | null;
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

  private flattenDesignTokens(tokens: unknown, path: string[] = []): DesignTokenLeaf[] {
    if (!tokens || typeof tokens !== 'object') return [];

    if ('$value' in (tokens as Record<string, unknown>)) {
      return [
        {
          path: path.join('.'),
          value: JSON.stringify((tokens as { $value: unknown }).$value),
        },
      ];
    }

    return Object.entries(tokens as Record<string, unknown>).flatMap(([key, value]) =>
      this.flattenDesignTokens(value, [...path, key]),
    );
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
      const selectedGroups = step.createSelectionSummary((tokens, path) => this.flattenDesignTokens(tokens, path));

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
      this.stepSelectionsSummary.textContent = `Design keuzes (${completedSteps}/${this.total})`;
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
}

StoryWizardController.init();
