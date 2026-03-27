import { resolveDynamicPresetOptions } from '@/lib/story-wizard-preset-resolution';
import type { StoryWizardPresetOption, StoryWizardThemeHost } from './types';
import { StoryWizardStep } from './StoryWizardStep';
import { StoryWizardStorage } from './StoryWizardStorage';

export class StoryWizardPresetState {
  private isSyncing = false;
  private readonly groups;
  private readonly dynamicGroups;

  public constructor(
    private readonly steps: StoryWizardStep[],
    private readonly storage: StoryWizardStorage,
    private readonly getTheme: () => StoryWizardThemeHost | null,
  ) {
    this.groups = steps.flatMap((step) => step.groups);
    this.dynamicGroups = this.groups.filter((group) =>
      group.getInitialOptions().some((option) => option.derivedTokenReference),
    );
  }

  public get syncing() {
    return this.isSyncing;
  }

  public async ready() {
    await customElements.whenDefined('wizard-token-preset');
    await this.waitForPresetInputs();
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
      ({ hasStoredState, restoredStepIndex } = this.runSync(() => this.storage.restore(this.steps)));
    }

    if (!hasStoredState) {
      this.runSync(() => this.restoreDefaultSelections());
    }

    this.runSync(() => this.syncDynamicOptions());
    await this.waitForPresetInputs();

    if (forceDefaultsAfterSync) {
      this.runSync(() => this.restoreDefaultSelections(true));
    }

    return restoredStepIndex;
  }

  public async reset() {
    this.runSync(() => this.clearSelections());
    this.storage.clear();
    await this.initialize({ forceDefaultsAfterSync: true, restoreStoredState: false });
  }

  public syncDynamicOptions() {
    const defaults = this.getTheme()?.theme?.defaults;
    const selectedOptions = this.groups.map((group) => group.getSelectedOption());

    this.dynamicGroups.forEach((group) => {
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

  private async waitForPresetInputs() {
    await Promise.all(
      this.groups.map((group) => group.input?.updateComplete ?? Promise.resolve())
    );
  }

  private runSync<T>(callback: () => T): T {
    this.isSyncing = true;

    try {
      return callback();
    } finally {
      this.isSyncing = false;
    }
  }

  private clearSelections() {
    this.steps.forEach((step) => step.clearSelections());
  }

  private restoreDefaultSelections(force = false) {
    this.steps.forEach((step) => step.restoreDefaultSelection(force));
  }
}
