import { initStories } from '@/components/render-stories';
import type { components } from '@/lib/components';
import type { StoryWizardStoredState, StoryWizardThemeHost } from './types';
import { StoryWizardPresetState } from './StoryWizardPresetState';
import { StoryWizardPreview } from './StoryWizardPreview';
import { StoryWizardStep } from './StoryWizardStep';
import { StoryWizardStorage } from './StoryWizardStorage';

export class StoryWizardStepController {
  public static init() {
    const container = document.getElementById('story-wizard');
    if (!container) return;
    new StoryWizardStepController(container)
      .#start()
      .catch((e) => console.error('Failed to initialize Story Wizard step', e));
  }

  readonly #componentId: keyof typeof components;
  readonly #step: StoryWizardStep;
  readonly #globalIndex: number;
  readonly #storage: StoryWizardStorage;
  readonly #preview: StoryWizardPreview;
  readonly #presetState: StoryWizardPresetState;
  readonly #container: HTMLElement;

  constructor(container: HTMLElement) {
    this.#container = container;
    this.#componentId = container.dataset.componentId as keyof typeof components;
    this.#storage = new StoryWizardStorage(this.#componentId);

    const root = container.closest<HTMLElement>('[data-story-wizard-root]') ?? container.parentElement ?? document.body;
    const stepEl = root.querySelector<HTMLElement>('.wizard-story-section');
    if (!stepEl) throw new Error('No wizard step element found');

    this.#step = new StoryWizardStep(stepEl);
    this.#globalIndex = parseInt(stepEl.dataset.stepGlobalIndex ?? '0');
    this.#preview = new StoryWizardPreview();
    this.#presetState = new StoryWizardPresetState([this.#step], () => this.#getTheme());
  }

  #getTheme(): StoryWizardThemeHost | null {
    return this.#container.closest('theme-wizard-app') as StoryWizardThemeHost | null;
  }

  async #start() {
    const stored = this.#storage.read();

    const stepState = stored?.steps[this.#globalIndex];
    if (stepState?.selections) {
      this.#step.restoreStoredSelection(stepState.selections);
    }

    await this.#presetState.ready();
    await this.#presetState.initialize({ hasStoredState: !!stored });

    await this.#initStories();
    this.#preview.apply([this.#step]);

    this.#bindOptionListeners();
    this.#bindPreviewModeToggles();
  }

  #bindOptionListeners() {
    this.#step.groups.forEach((group, groupIndex) => {
      group.bindOptions(() => {
        if (!this.#presetState.syncing && this.#presetState.isInitialized && !this.#step.isAdvanced) {
          this.#saveState(groupIndex, group.hasSelection());
        } else {
          this.#saveState();
        }
        this.#presetState.syncDynamicOptions();
        this.#preview.apply([this.#step]);
      });
    });

    document.addEventListener('theme-update', () => {
      if (this.#step.isAdvanced) {
        this.#markAdvancedVisited();
      }
      this.#preview.apply([this.#step]);
    });
  }

  #bindPreviewModeToggles() {
    const buttons = Array.from(this.#step.element.querySelectorAll<HTMLButtonElement>('[data-preview-mode-btn]'));
    const panels = Array.from(this.#step.element.querySelectorAll<HTMLElement>('[data-preview-mode-panel]'));
    if (!buttons.length || !panels.length) return;

    const setMode = (mode: string) => {
      buttons.forEach((btn) => {
        const isActive = btn.dataset.previewModeBtn === mode;
        btn.setAttribute('aria-pressed', String(isActive));
        btn.classList.toggle('wizard-story-preview-panel__toggle--active', isActive);
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.previewModePanel !== mode;
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.previewModeBtn;
        if (mode) setMode(mode);
      });
    });

    setMode('focused');
  }

  #saveState(changedGroupIndex?: number, isChosen?: boolean) {
    const stored = this.#readOrInit();
    const existing = stored.steps[this.#globalIndex];

    const selections = this.#step.getStoredSelection();
    const chosenSelections = selections.map((sel, i) => {
      if (changedGroupIndex === i) return Boolean(isChosen && sel >= 0);
      if (sel < 0) return false;
      return existing.chosenSelections[i] ?? false;
    });
    const selectionLabels = this.#step.groups.map((group) => group.input?.optionLabel ?? '');

    stored.steps[this.#globalIndex] = {
      advancedVisited: existing.advancedVisited,
      chosenSelections,
      selectionLabels,
      selections,
    };
    stored.currentStep = this.#globalIndex;
    this.#storage.write(stored);
  }

  #markAdvancedVisited() {
    const stored = this.#readOrInit();
    stored.steps[this.#globalIndex].advancedVisited = true;
    stored.currentStep = this.#globalIndex;
    this.#storage.write(stored);
  }

  #readOrInit(): StoryWizardStoredState {
    const stored = this.#storage.read() ?? { currentStep: this.#globalIndex, steps: [] };
    while (stored.steps.length <= this.#globalIndex) {
      stored.steps.push({ advancedVisited: false, chosenSelections: [], selections: [] });
    }
    return stored;
  }

  async #initStories() {
    const storyIds = [
      ...new Set(
        Array.from(this.#step.element.querySelectorAll<HTMLElement>('[data-story-container]')).flatMap((el) => {
          const id = el.dataset.storyContainer;
          return id?.length ? [id] : [];
        }),
      ),
    ];

    if (storyIds.length > 0) {
      await initStories(this.#componentId, storyIds, this.#step.element);
      this.#preview.apply([this.#step]);
    }
  }
}
