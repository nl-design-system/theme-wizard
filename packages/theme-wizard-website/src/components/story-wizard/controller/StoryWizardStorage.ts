import type { StoryWizardStoredState } from './types';

export class StoryWizardStorage {
  readonly #key: string;
  #lastSerializedState: string | null = null;

  public constructor(componentId: string) {
    this.#key = `theme-wizard:${componentId}:preset-state`;
  }

  public read(): StoryWizardStoredState | null {
    try {
      const raw = globalThis.localStorage?.getItem(this.#key);
      this.#lastSerializedState = raw;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public write(state: StoryWizardStoredState) {
    try {
      const serializedState = JSON.stringify(state);
      if (serializedState === this.#lastSerializedState) {
        return;
      }

      globalThis.localStorage?.setItem(this.#key, serializedState);
      this.#lastSerializedState = serializedState;
    } catch {
      // Progressive enhancement: ignore storage failures and keep the wizard usable.
    }
  }
}
