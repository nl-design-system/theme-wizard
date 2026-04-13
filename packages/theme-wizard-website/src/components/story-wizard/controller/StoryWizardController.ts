import { presetTokensToUpdateMany } from '@app/lib/Theme/lib';
import { initStories } from '@/components/render-stories';
import { components } from '@/lib/components';
import type { StoryWizardStepState, StoryWizardThemeHost } from './types';
import { StoryWizardNavigation } from './StoryWizardNavigation';
import { StoryWizardNavigationState } from './StoryWizardNavigationState';
import { StoryWizardPresetState } from './StoryWizardPresetState';
import { StoryWizardPreview } from './StoryWizardPreview';
import { StoryWizardState } from './StoryWizardState';
import { StoryWizardStep } from './StoryWizardStep';
import { StoryWizardStorage } from './StoryWizardStorage';
import { StoryWizardSummary } from './StoryWizardSummary';
import { StoryWizardTokensDialog } from './StoryWizardTokensDialog';

export class StoryWizardController {
  readonly #componentId: keyof typeof components;
  readonly #steps: StoryWizardStep[];
  readonly #storage: StoryWizardStorage;
  readonly #navigation: StoryWizardNavigation;
  readonly #summary: StoryWizardSummary;
  readonly #dialog: StoryWizardTokensDialog;
  readonly #preview: StoryWizardPreview;
  readonly #presetState: StoryWizardPresetState;
  readonly #state: StoryWizardState;
  readonly #nav: StoryWizardNavigationState;
  readonly #container: HTMLElement;

  public constructor(container: HTMLElement) {
    this.#container = container;
    this.#componentId = container.dataset.componentId as keyof typeof components;
    const root = container.closest<HTMLElement>('[data-story-wizard-root]') ?? container.parentElement ?? document;
    const shell = container.closest<HTMLElement>('.wizard-main') ?? root;

    this.#steps = Array.from(root.querySelectorAll<HTMLElement>('.wizard-story-section')).map(
      (element) => new StoryWizardStep(element),
    );

    this.#nav = new StoryWizardNavigationState(this.#steps);
    this.#state = new StoryWizardState(this.#steps);
    this.#storage = new StoryWizardStorage(this.#componentId);
    this.#dialog = new StoryWizardTokensDialog();
    this.#summary = new StoryWizardSummary(
      root,
      components[this.#componentId].title,
      this.#dialog,
      (index) => this.#showStep(index),
      () => this.#reset().catch((e) => console.error('Failed to reset Story Wizard', e)),
    );
    this.#navigation = new StoryWizardNavigation(root, shell);
    this.#preview = new StoryWizardPreview();
    this.#presetState = new StoryWizardPresetState(this.#steps, () => this.#getTheme());

    window.addEventListener('hashchange', () => this.#syncStateWithHash());
  }

  public static init() {
    const container = document.getElementById('story-wizard');
    if (!container) return;

    new StoryWizardController(container).#start().catch((error) => {
      console.error('Failed to initialize Story Wizard', error);
    });
  }

  #getTheme() {
    return this.#container.closest('theme-wizard-app') as StoryWizardThemeHost | null;
  }

  // --- Lifecycle ---

  async #start() {
    await this.#presetState.ready();
    initStories(this.#componentId, JSON.parse(this.#container.dataset.storyIds || '[]'));
    this.#bindOptionListeners();
    this.#bindPreviewModeToggles();
    this.#navigation.bind();

    if (this.#nav.total === 0) {
      this.#navigation.hideSteppers();
      return;
    }

    this.#summary.show();
    this.#navigation.showSteppers();
    const restored = this.#state.restore(this.#storage.read(), this.#steps);
    if (restored.hasStoredState) {
      this.#state.goToStep(restored.restoredStepIndex);
    }

    await this.#presetState.initialize({ hasStoredState: restored.hasStoredState });
    this.#syncStateWithHash();
  }

  async #reset() {
    this.#state.reset(this.#steps);
    const paths = this.#getAllAffectedTokenPaths();
    this.#container
      .closest('theme-wizard-app')
      ?.dispatchEvent(new CustomEvent('reset-tokens', { bubbles: true, composed: true, detail: { paths } }));
    await this.#presetState.reset();
    this.#storage.write(this.#state.snapshot());
    this.#showOverview();
  }

  /**
   * Collects all token paths that the story wizard can affect:
   * all options from all preset groups, plus editable token paths from advanced steps.
   */
  #getAllAffectedTokenPaths(): string[] {
    const presetPaths = this.#steps.flatMap((step) =>
      step.groups.flatMap((group) =>
        group.getOptions().flatMap((option) => presetTokensToUpdateMany(option.tokens).map(({ path }) => path)),
      ),
    );

    const editablePaths = this.#steps.flatMap((step) => step.editableTokenPaths);

    return [...new Set([...presetPaths, ...editablePaths])];
  }

  // --- Navigation ---

  #syncStateWithHash() {
    const hash = window.location.hash.replace('#', '');

    if (!hash || hash === 'wizard-overview') {
      this.#showOverview();
      return;
    }

    const stepIndex = this.#steps.findIndex((step) => step.element.id === hash);
    if (stepIndex >= 0) {
      this.#showStep(stepIndex);
    } else {
      this.#showOverview();
    }
  }

  #showOverview() {
    this.#confirmCurrentAdvancedStep();
    this.#steps.forEach((step) => step.hide());
    this.#summary.hide();
    this.#navigation.showOverview();
    this.#updateSummary();
    this.#refreshStepNavigation();
    this.#persistStepState();
  }

  #showStep(index: number) {
    this.#confirmCurrentAdvancedStep();
    this.#state.goToStep(index);
    this.#navigation.hideOverview();
    this.#summary.show();
    this.#updateVisibleStep(index);
    this.#refreshStepNavigation();
    this.#refreshStepView();
    this.#persistStepState();
  }

  // --- Selection sync ---

  #bindOptionListeners() {
    this.#steps.forEach((step, stepIndex) => {
      step.groups.forEach((group, groupIndex) => {
        group.bindOptions(() => {
          if (!this.#presetState.syncing && this.#presetState.isInitialized && !step.isAdvanced) {
            this.#state.markPresetGroupChosen(stepIndex, groupIndex, group.hasSelection());
          }

          this.#presetState.syncDynamicOptions();
          this.#refreshSelectionState();
        });
      });
    });

    document.addEventListener('theme-update', () => {
      const currentStep = this.#steps[this.#state.currentStep];
      if (currentStep?.isAdvanced && this.#summary.getAdvancedSummary(currentStep, this.#getTheme()).length > 0) {
        this.#state.confirmAdvancedStep(this.#state.currentStep);
      }

      this.#refreshSelectionState();
      this.#preview.apply(this.#steps);
    });
  }

  #bindPreviewModeToggles() {
    this.#steps.forEach((step) => {
      const buttons = Array.from(step.element.querySelectorAll<HTMLButtonElement>('[data-preview-mode-btn]'));
      const panels = Array.from(step.element.querySelectorAll<HTMLElement>('[data-preview-mode-panel]'));

      if (buttons.length === 0 || panels.length === 0) {
        return;
      }

      const setMode = (mode: string) => {
        buttons.forEach((button) => {
          const isActive = button.dataset.previewModeBtn === mode;
          button.setAttribute('aria-pressed', String(isActive));
          button.classList.toggle('wizard-story-preview-panel__toggle--active', isActive);
        });

        panels.forEach((panel) => {
          panel.hidden = panel.dataset.previewModePanel !== mode;
        });
      };

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const mode = button.dataset.previewModeBtn;
          if (!mode) return;
          setMode(mode);
        });
      });

      setMode('focused');
    });
  }

  // --- Summary & navigation updates ---

  #updateVisibleStep(index: number) {
    this.#steps.forEach((step, i) => (i === index ? step.show() : step.hide()));
  }

  #refreshStepNavigation() {
    const stepsState = this.#getSelectionSummary();

    this.#navigation.updateStepNavState(this.#state.currentStep, stepsState);
  }

  #refreshStepView() {
    this.#updateSummary();
    this.#preview.apply(this.#steps);
  }

  #persistStepState() {
    this.#storage.write(this.#state.capture(this.#state.currentStep, this.#steps));
  }

  #refreshSelectionState() {
    this.#persistStepState();
    this.#updateSummary();
    this.#refreshStepNavigation();
  }

  #updateSummary() {
    const stepsState = this.#getSelectionSummary();
    this.#summary.update(stepsState);
  }

  // --- Step helpers ---

  #confirmCurrentAdvancedStep(force = false) {
    const currentStep = this.#steps[this.#state.currentStep];
    if (!currentStep?.isAdvanced) {
      return;
    }

    const hasAdvancedChanges = this.#summary.getAdvancedSummary(currentStep, this.#getTheme()).length > 0;
    if (force || hasAdvancedChanges) {
      this.#state.confirmAdvancedStep(this.#state.currentStep);
    }
  }

  #getSelectionSummary(): StoryWizardStepState[] {
    const themeHost = this.#getTheme();

    return this.#steps.map((step, index) => {
      const liveSelectedGroups = step.isAdvanced
        ? this.#summary.getAdvancedSummary(step, themeHost)
        : this.#state.hasChosenSelection(index)
          ? step.createCurrentSelectionSummary()
          : [];
      const confirmedGroups = step.isAdvanced
        ? liveSelectedGroups
        : step.createSelectionSummaryFromChosenSelections(this.#state.getChosenSelections(index));
      const isCompletedAdvancedStep = step.isAdvanced && this.#state.hasBeenVisited(index);
      const isConfirmedAdvancedStep = step.isAdvanced && (liveSelectedGroups.length > 0 || isCompletedAdvancedStep);

      const summaries = (() => {
        if (!step.isAdvanced) return liveSelectedGroups;
        if (!isConfirmedAdvancedStep) return [];
        if (liveSelectedGroups.length > 0) return liveSelectedGroups;
        return this.#summary.getAdvancedSummary(step, themeHost, { includeUnchangedTokens: true });
      })();

      const isDone = step.isAdvanced ? isConfirmedAdvancedStep : confirmedGroups.length > 0;

      return {
        hasResettableState: step.isAdvanced ? this.#state.hasBeenVisited(index) : this.#state.hasChosenSelection(index),
        isConfirmedAdvanced: isConfirmedAdvancedStep,
        isDone,
        step,
        summaries,
      };
    });
  }
}
