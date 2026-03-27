import type { components } from '@/lib/components';
import { initStories } from '@/components/render-stories';
import type { StoryWizardThemeHost } from './types';
import { StoryWizardNavigation } from './StoryWizardNavigation';
import { StoryWizardNavigationState } from './StoryWizardNavigationState';
import { StoryWizardPresetState } from './StoryWizardPresetState';
import { StoryWizardPreview } from './StoryWizardPreview';
import { StoryWizardStep } from './StoryWizardStep';
import { StoryWizardStorage } from './StoryWizardStorage';
import { StoryWizardSummary } from './StoryWizardSummary';
import { StoryWizardTokensDialog } from './StoryWizardTokensDialog';

export class StoryWizardController {
  private readonly componentId: keyof typeof components;
  private readonly steps: StoryWizardStep[];
  private readonly storage: StoryWizardStorage;
  private readonly navigation: StoryWizardNavigation;
  private readonly summary: StoryWizardSummary;
  private readonly dialog: StoryWizardTokensDialog;
  private readonly preview: StoryWizardPreview;
  private readonly presetState: StoryWizardPresetState;
  private readonly nav: StoryWizardNavigationState;

  public constructor(private readonly container: HTMLElement) {
    this.componentId = container.dataset.componentId as keyof typeof components;
    const root = container.closest<HTMLElement>('[data-story-wizard-root]') ?? container.parentElement ?? document;
    const shell = container.closest<HTMLElement>('.wizard-main') ?? root;

    this.steps = Array.from(root.querySelectorAll<HTMLElement>('.wizard-story-section')).map(
      (element) => new StoryWizardStep(element),
    );

    this.nav = new StoryWizardNavigationState(this.steps);
    this.storage = new StoryWizardStorage(this.componentId);
    this.dialog = new StoryWizardTokensDialog();
    this.summary = new StoryWizardSummary(root, this.dialog, (index) => this.showStep(index));
    this.navigation = new StoryWizardNavigation(root, shell);
    this.preview = new StoryWizardPreview();
    this.presetState = new StoryWizardPresetState(this.steps, this.storage, () => this.getTheme());
  }

  public static init() {
    const container = document.getElementById('story-wizard');
    if (!container) return;

    new StoryWizardController(container).start().catch((error) => {
      console.error('Failed to initialize Story Wizard', error);
    });
  }

  private getTheme() {
    return this.container.closest('theme-wizard-app') as StoryWizardThemeHost | null;
  }

  // --- Lifecycle ---

  private async start() {
    await this.presetState.ready();
    initStories(this.componentId, JSON.parse(this.container.dataset.storyIds || '[]'));
    this.bindOptionListeners();
    this.navigation.bind({
      onFinishSafe: () => this.finishWithSafeChoices(),
      onNext: () => this.handleNext(),
      onPrev: () => this.handlePrev(),
      onReset: () => this.reset().catch((e) => console.error('Failed to reset Story Wizard', e)),
    });

    if (this.nav.total === 0) {
      this.navigation.hideSteppers();
      return;
    }

    this.summary.show();
    this.navigation.showSteppers();
    const restoredStepIndex = await this.presetState.initialize({ restoreStoredState: true });
    this.showStep(restoredStepIndex);
  }

  private async reset() {
    this.nav.reset();
    this.container.closest('theme-wizard-app')?.dispatchEvent(new Event('reset', { bubbles: true, composed: true }));
    await this.presetState.reset();
    this.showStep(0);
  }

  // --- Navigation handlers ---

  private handleNext() {
    this.steps[this.nav.currentStep]?.confirmSelections();
    this.confirmCurrentAdvancedStep(true);
    this.refreshSelectionState();

    if (this.nav.isLastStep) {
      this.finishWithAllChoices();
    } else {
      this.showStep(this.nav.currentStep + 1);
    }
  }

  private handlePrev() {
    if (!this.nav.isFirstStep) this.showStep(this.nav.currentStep - 1);
  }

  private confirmCurrentAdvancedStep(force = false) {
    const currentStep = this.steps[this.nav.currentStep];
    if (!currentStep?.isAdvanced) {
      return;
    }

    const hasAdvancedChanges = this.summary.getAdvancedSummary(currentStep, this.getTheme()).length > 0;
    if (force || hasAdvancedChanges) {
      currentStep.confirmAdvancedSelection();
    }
  }

  private showStep(index: number) {
    this.confirmCurrentAdvancedStep();
    this.nav.goTo(index);
    this.updateVisibleStep(index);
    this.refreshStepNavigation();
    this.refreshStepView();
    this.persistStepState();
  }

  // --- Finish flows ---

  private finishWithSafeChoices() {
    this.steps[this.nav.currentStep]?.confirmSelections();
    this.refreshSelectionState();

    const safeSteps = this.steps.slice(0, Math.max(this.nav.lastSafeStepIndex + 1, 0));
    const groups = safeSteps.flatMap((step) => step.createSelectionSummary());
    if (groups.length === 0) return;

    this.dialog.show('Veilige keuzes', groups);
    this.summary.openDetails();
  }

  private finishWithAllChoices() {
    const groups = this.getAllSelectionGroups(true);
    if (groups.length === 0) return;

    this.nav.finish();
    this.updateSummary();
    this.dialog.show('Alle design keuzes', groups);
    this.summary.openDetails();
  }

  // --- Selection sync ---

  private bindOptionListeners() {
    this.steps.forEach((step) => {
      step.bindOptions((group) => {
        if (!this.presetState.syncing) {
          group.markAsChosen();
        }

        this.presetState.syncDynamicOptions();
        this.refreshSelectionState();
      });
    });

    document.addEventListener('theme-update', () => {
      this.preview.apply(this.steps);
    });
  }

  // --- Summary & navigation updates ---

  private updateVisibleStep(index: number) {
    this.steps.forEach((step, i) => (i === index ? step.show() : step.hide()));
  }

  private refreshStepNavigation() {
    this.navigation.updatePrevState(this.nav.isFirstStep);
    this.updateNavigationState();
  }

  private refreshStepView() {
    this.updateSummary();
    this.preview.apply(this.steps);
  }

  private persistStepState() {
    this.storage.write(this.nav.currentStep, this.steps);
  }

  private refreshSelectionState() {
    this.persistStepState();
    this.updateSummary();
    this.updateNavigationState();
  }

  private updateSummary() {
    this.summary.update(this.steps, this.getTheme());
  }

  private updateNavigationState() {
    const currentStep = this.steps[this.nav.currentStep];
    if (!currentStep) return;

    this.navigation.updateNextState(currentStep, this.nav);
  }

  // --- Step helpers ---

  private getAllSelectionGroups(includeAdvancedDefaults = false) {
    return this.steps.flatMap((step) => {
      if (step.isAdvanced) {
        return includeAdvancedDefaults
          ? this.summary.getAdvancedSummary(step, this.getTheme(), { includeUnchangedTokens: true })
          : [];
      }

      return step.createSelectionSummary();
    });
  }
}
