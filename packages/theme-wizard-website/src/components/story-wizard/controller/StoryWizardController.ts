import { presetTokensToUpdateMany } from '@app/lib/Theme/lib';
import type { components } from '@/lib/components';
import { initStories } from '@/components/render-stories';
import type { StoryWizardStepState, StoryWizardThemeHost } from './types';
import { StoryWizardNavigation } from './StoryWizardNavigation';
import { StoryWizardNavigationState } from './StoryWizardNavigationState';
import { StoryWizardPresetState } from './StoryWizardPresetState';
import { StoryWizardPreview } from './StoryWizardPreview';
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
    this.#storage = new StoryWizardStorage(this.#componentId);
    this.#dialog = new StoryWizardTokensDialog();
    this.#summary = new StoryWizardSummary(
      root,
      this.#dialog,
      (index) => this.#showStep(index),
      () => this.#reset().catch((e) => console.error('Failed to reset Story Wizard', e)),
    );
    this.#navigation = new StoryWizardNavigation(root, shell);
    this.#preview = new StoryWizardPreview();
    this.#presetState = new StoryWizardPresetState(this.#steps, this.#storage, () => this.#getTheme());

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
    this.#navigation.bind({
      onFinishSafe: () => this.#finishWithSafeChoices(),
      onJumpTo: (index) => {
        const step = this.#steps[index];
        if (step) window.location.hash = (step.element as HTMLElement).id;
      },
      onReset: () => this.#reset().catch((e) => console.error('Failed to reset Story Wizard', e)),
      onShowOverview: () => {
        window.location.hash = 'wizard-overview';
      },
    });

    if (this.#nav.total === 0) {
      this.#navigation.hideSteppers();
      return;
    }

    this.#summary.show();
    this.#navigation.showSteppers();
    await this.#presetState.initialize({ restoreStoredState: true });
    this.#syncStateWithHash();
  }

  async #reset() {
    this.#nav.reset();
    const paths = this.#getAllAffectedTokenPaths();
    this.#container
      .closest('theme-wizard-app')
      ?.dispatchEvent(new CustomEvent('reset-tokens', { bubbles: true, composed: true, detail: { paths } }));
    await this.#presetState.reset();
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
    this.#navigation.showOverview();
    this.#refreshStepNavigation();
    this.#persistStepState();
  }

  #showStep(index: number) {
    this.#confirmCurrentAdvancedStep();
    this.#nav.goTo(index);
    this.#navigation.hideOverview();
    this.#updateVisibleStep(index);
    this.#refreshStepNavigation();
    this.#refreshStepView();
    this.#persistStepState();
  }

  // --- Finish flows ---

  #finishWithSafeChoices() {
    this.#steps[this.#nav.currentStep]?.confirmSelections();
    this.#refreshSelectionState();

    const safeSteps = this.#steps.slice(0, Math.max(this.#nav.lastSafeStepIndex + 1, 0));
    const groups = safeSteps.flatMap((step) => step.createSelectionSummary());
    if (groups.length === 0) return;

    this.#dialog.show('Veilige keuzes', groups);
    this.#summary.openDetails();
  }

  #finishWithAllChoices() {
    const groups = this.#getAllSelectionGroups(true);
    if (groups.length === 0) return;

    this.#nav.finish();
    this.#updateSummary();
    this.#dialog.show('Alle design keuzes', groups);
    this.#summary.openDetails();
  }

  // --- Selection sync ---

  #bindOptionListeners() {
    this.#steps.forEach((step) => {
      step.bindOptions((group) => {
        if (!this.#presetState.syncing) {
          group.markAsChosen();
        }

        this.#presetState.syncDynamicOptions();
        this.#refreshSelectionState();
      });
    });

    document.addEventListener('theme-update', () => {
      this.#preview.apply(this.#steps);
    });
  }

  #bindPreviewModeToggles() {
    this.#steps.forEach((step) => {
      const buttons = Array.from(
        step.element.querySelectorAll<HTMLButtonElement>('[data-preview-mode-btn]'),
      );
      const panels = Array.from(
        step.element.querySelectorAll<HTMLElement>('[data-preview-mode-panel]'),
      );

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
    const currentStep = this.#steps[this.#nav.currentStep];
    const stepsState = this.#getSelectionSummary();

    if (currentStep) {
      this.#navigation.updateNextState(currentStep, this.#nav);
    }
    this.#navigation.updateStepNavState(this.#nav.currentStep, stepsState);
  }

  #refreshStepView() {
    this.#updateSummary();
    this.#preview.apply(this.#steps);
  }

  #persistStepState() {
    this.#storage.write(this.#nav.currentStep, this.#steps);
  }

  #refreshSelectionState() {
    this.#persistStepState();
    this.#updateSummary();
    this.#refreshStepNavigation();
  }

  #updateSummary() {
    const stepsState = this.#getSelectionSummary();
    this.#summary.update(stepsState, this.#getTheme());
  }

  // --- Step helpers ---

  #confirmCurrentAdvancedStep(force = false) {
    const currentStep = this.#steps[this.#nav.currentStep];
    if (!currentStep?.isAdvanced) {
      return;
    }

    const hasAdvancedChanges = this.#summary.getAdvancedSummary(currentStep, this.#getTheme()).length > 0;
    if (force || hasAdvancedChanges) {
      currentStep.confirmAdvancedSelection();
    }
  }

  #getSelectionSummary(): StoryWizardStepState[] {
    const themeHost = this.#getTheme();

    return this.#steps.map((step) => {
      const liveSelectedGroups = step.isAdvanced
        ? this.#summary.getAdvancedSummary(step, themeHost)
        : step.createCurrentSelectionSummary();
      const confirmedGroups = step.isAdvanced ? liveSelectedGroups : step.createSelectionSummary();
      const isCompletedAdvancedStep = step.isAdvanced && step.hasBeenVisited();
      const isConfirmedAdvancedStep = step.isAdvanced && (liveSelectedGroups.length > 0 || isCompletedAdvancedStep);

      const summaries = ((): any[] => {
        if (!step.isAdvanced) return liveSelectedGroups;
        if (!isConfirmedAdvancedStep) return [];
        if (liveSelectedGroups.length > 0) return liveSelectedGroups;
        return this.#summary.getAdvancedSummary(step, themeHost, { includeUnchangedTokens: true });
      })();

      const isDone = step.isAdvanced ? isConfirmedAdvancedStep : confirmedGroups.length > 0;

      return {
        step,
        summaries,
        isDone,
        isConfirmedAdvanced: isConfirmedAdvancedStep,
      };
    });
  }

  #getAllSelectionGroups(includeAdvancedDefaults = false) {
    const stepsState = this.#getSelectionSummary();

    return stepsState.flatMap((state) => {
      if (state.step.isAdvanced) {
        return includeAdvancedDefaults
          ? state.summaries.length > 0
            ? state.summaries
            : this.#summary.getAdvancedSummary(state.step, this.#getTheme(), { includeUnchangedTokens: true })
          : [];
      }

      return state.step.createSelectionSummary();
    });
  }
}
