import type { ClippyContentSelect } from '@nl-design-system-community/clippy-components/clippy-content-select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { consume } from '@lit/context';
import { arrayFromTokenList } from '@nl-design-system-community/clippy-components/lib/converters';
import '@nl-design-system-community/clippy-components/clippy-content-select';
import { dset } from 'dset';
import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import '../wizard-story-example';
import { flattenTokens } from '../../lib/Theme/lib';
import { loadComponentStories, type ComponentStoriesRegistry } from '../../utils/component-stories';
import { APPLY_TOKEN_PRESET_EVENT, type ApplyTokenPresetDetail } from '../../utils/events';
import { getRelevantPresetFolders, type TokenPresetFolder } from '../../utils/token-presets';
import styles from './styles';

const tag = 'wizard-tokens-presets';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokensPresets;
  }
}

const PLACEHOLDER_VALUE = '';

type PresetStory = {
  // Value of the story meta's `parameters.presets`, e.g. `nl.link`
  folder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Meta<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: StoryObj<any>;
};

type PresetMatch = PresetStory & Pick<TokenPresetFolder, 'presets'>;

/**
 * Renders a preset select with story preview for every component preset folder relevant to any of `paths`.
 * Choosing a preset dispatches `apply-token-preset` so wizard-app applies it to the theme.
 */
@customElement(tag)
export class WizardTokensPresets extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme?: Theme;

  // Space-separated token paths, e.g. `basis.color.accent-1 basis.color.accent-2`
  @property({ converter: arrayFromTokenList })
  paths: string[] | null = [];

  // Caller-supplied registry of components; modules opt in with meta `parameters.presets`, pick a story with `parameters.presetStory`
  @property({ attribute: false })
  components: ComponentStoriesRegistry = {};

  @state() private presetMatches: PresetMatch[] = [];
  @state() private selectedPresets: Record<string, string> = {};

  override hidden = true;

  // Stories that opted in to presets, derived once per `components` assignment
  #presetStories: PresetStory[] = [];

  // Guards against a slower, earlier load overwriting a newer one
  #loadRun = 0;

  // Theme values per folder from before its first preset was applied, restored by the placeholder
  readonly #originalTokens = new Map<string, Record<string, unknown>>();

  // Set while our own preset apply is pending, so the resulting theme update keeps the snapshots
  #isApplyingTokens = false;

  /** Resets snapshots on outside theme changes, reloads stories on `components`, recomputes matches on `paths`. */
  protected override async willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('theme')) {
      this.#handleThemeChange();
    }

    if (changedProperties.has('components')) {
      await this.#loadPresetStories();
      return;
    }

    if (changedProperties.has('paths')) {
      this.#recomputeMatches();
    }
  }

  /** Loads the registry and picks one preview story per module that opted in to presets. */
  async #loadPresetStories() {
    const run = ++this.#loadRun;
    const loadedComponents = await loadComponentStories(this.components);
    if (run !== this.#loadRun) {
      return;
    }

    this.#presetStories = loadedComponents.flatMap(({ meta, stories }) => {
      const folder = meta.parameters?.['presets'];
      if (typeof folder !== 'string') {
        return [];
      }

      // Drop story ids from the `[id, story]` entries
      const storyObjects = stories.map(([, story]) => story);

      const optInStory = storyObjects.find((story) => story.parameters?.['presetStory'] === true);
      if (optInStory) {
        return [{ folder, meta, story: optInStory }];
      }

      const firstStory = storyObjects[0];
      if (firstStory) {
        return [{ folder, meta, story: firstStory }];
      }

      return [];
    });
    this.#recomputeMatches();
  }

  /** Pairs preview stories with preset folders relevant to any of `paths`, once per folder. */
  #recomputeMatches() {
    // Keyed by folder name to dedupe folders matched by more than one path
    const relevantFolders = new Map<string, TokenPresetFolder>();
    for (const path of this.paths ?? []) {
      for (const presetFolder of getRelevantPresetFolders(path)) {
        relevantFolders.set(presetFolder.folder, presetFolder);
      }
    }

    const presetMatches: PresetMatch[] = [];
    for (const presetStory of this.#presetStories) {
      const presetFolder = relevantFolders.get(presetStory.folder);
      if (presetFolder) {
        presetMatches.push({ ...presetStory, presets: presetFolder.presets });
      }
    }
    this.presetMatches = presetMatches;
    this.hidden = this.presetMatches.length === 0;
  }

  /** Stores current theme values of every token the folder's presets set, once per folder. */
  #snapshotFolder({ folder, presets }: PresetMatch) {
    if (this.#originalTokens.has(folder) || !this.theme) {
      return;
    }
    const snapshot: Record<string, unknown> = {};
    for (const { tokens } of presets) {
      for (const path of Object.keys(flattenTokens(tokens))) {
        const token = this.theme.at(path);
        if (token) {
          dset(snapshot, path, structuredClone(token));
        }
      }
    }
    this.#originalTokens.set(folder, snapshot);
  }

  /** Treats an outside theme change (e.g. another tab) as the new baseline for the placeholder. */
  #handleThemeChange() {
    if (this.#isApplyingTokens) {
      this.#isApplyingTokens = false;
      return;
    }
    this.#originalTokens.clear();
    this.selectedPresets = Object.create(null);
  }

  /** Dispatches `apply-token-preset` so wizard-app writes the tokens into the theme. */
  #applyTokens(tokens: Record<string, unknown>) {
    this.#isApplyingTokens = true;
    this.dispatchEvent(
      new CustomEvent<ApplyTokenPresetDetail>(APPLY_TOKEN_PRESET_EVENT, {
        bubbles: true,
        composed: true,
        detail: { tokens },
      }),
    );
  }

  /** Applies the chosen preset, or restores the original values when the placeholder is chosen. */
  #handlePresetChange(event: Event, match: PresetMatch) {
    const { folder, presets } = match;
    const value = String((event.currentTarget as ClippyContentSelect).value ?? PLACEHOLDER_VALUE);
    this.selectedPresets = { ...this.selectedPresets, [folder]: value };

    const preset = presets.find(({ name }) => name === value);
    if (preset) {
      this.#snapshotFolder(match);
      this.#applyTokens(preset.tokens);
      return;
    }

    const originalTokens = this.#originalTokens.get(folder);
    if (originalTokens) {
      this.#applyTokens(originalTokens);
    }
  }

  /** Renders a preset select with story preview per matched folder. */
  override render() {
    if (this.presetMatches.length === 0) {
      return nothing;
    }

    return html`
      ${this.presetMatches.map(
        (match) => html`
          <clippy-content-select
            hidden-label=${match.meta.title ?? match.folder}
            .options=${[
              { label: t('tokensPresets.placeholder'), value: PLACEHOLDER_VALUE },
              ...match.presets.map(({ name }) => ({ label: name, value: name })),
            ]}
            .value=${this.selectedPresets[match.folder] ?? PLACEHOLDER_VALUE}
            @change=${(event: Event) => this.#handlePresetChange(event, match)}
          >
            <wizard-story-example
              .componentMeta=${match.meta}
              .story=${match.story}
              .args=${match.story.args ?? {}}
            ></wizard-story-example>
          </clippy-content-select>
        `,
      )}
    `;
  }
}
