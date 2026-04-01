import { resolveDynamicPresetOptions } from '@/lib/story-wizard-preset-resolution';
import type { StoryWizardPresetOption, StoryWizardThemeHost } from './types';
import { StoryWizardStep } from './StoryWizardStep';
import { StoryWizardStorage } from './StoryWizardStorage';

export class StoryWizardPresetState {
  #isSyncing = false;
  readonly #groups;
  readonly #dynamicGroups;
  readonly #steps: StoryWizardStep[];
  readonly #storage: StoryWizardStorage;
  readonly #getTheme: () => StoryWizardThemeHost | null;

  public constructor(
    steps: StoryWizardStep[],
    storage: StoryWizardStorage,
    getTheme: () => StoryWizardThemeHost | null,
  ) {
    this.#steps = steps;
    this.#storage = storage;
    this.#getTheme = getTheme;
    this.#groups = steps.flatMap((step) => step.groups);
    this.#dynamicGroups = this.#groups.filter((group) =>
      group.getInitialOptions().some(
        (option) => option.derivedTokenReference || (Array.isArray(option.derivedTokenReferences) && option.derivedTokenReferences.length > 0),
      ),
    );
  }

  public get syncing() {
    return this.#isSyncing;
  }

  public async ready() {
    await customElements.whenDefined('wizard-token-preset');
    await this.#waitForPresetInputs();
  }

  public async initialize({
    forceDefaultsAfterSync = false,
    restoreStoredState,
  }: {
    forceDefaultsAfterSync?: boolean;
    restoreStoredState: boolean;
  }) {
    let restoredStepIndex = 0;
    let hasStoredState = false;

    if (restoreStoredState) {
      ({ hasStoredState, restoredStepIndex } = this.#runSync(() => this.#storage.restore(this.#steps)));
    }

    if (!hasStoredState) {
      this.#runSync(() => this.#restoreDefaultSelections());
    }

    this.#runSync(() => this.syncDynamicOptions());
    await this.#waitForPresetInputs();

    if (forceDefaultsAfterSync) {
      this.#runSync(() => this.#restoreDefaultSelections(true));
    }

    return restoredStepIndex;
  }

  public async reset() {
    this.#runSync(() => this.#clearSelections());
    this.#storage.clear();
    await this.initialize({ forceDefaultsAfterSync: true, restoreStoredState: false });
  }

  public syncDynamicOptions() {
    const defaults = this.#getTheme()?.theme?.defaults;
    const selectedOptions = this.#groups.map((group) => group.getSelectedOption());

    this.#dynamicGroups.forEach((group) => {
      group.setOptions(
        resolveDynamicPresetOptions<StoryWizardPresetOption>({
          defaults,
          options: group.getInitialOptions(),
          selectedOptions,
        }),
      );

      if (!group.hasSelection()) {
        group.restoreDefaultSelection();
      }
    });
  }

  async #waitForPresetInputs() {
    await Promise.all(
      this.#groups.map((group) => group.input?.updateComplete ?? Promise.resolve())
    );
  }

  #runSync<T>(callback: () => T): T {
    this.#isSyncing = true;

    try {
      return callback();
    } finally {
      this.#isSyncing = false;
    }
  }

  #clearSelections() {
    this.#steps.forEach((step) => step.clearSelections());
  }

  #restoreDefaultSelections(force = false) {
    this.#steps.forEach((step) => step.restoreDefaultSelection(force));
  }
}
