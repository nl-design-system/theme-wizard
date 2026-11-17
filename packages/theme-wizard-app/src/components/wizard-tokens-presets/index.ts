import type { ClippyContentSelect } from '@nl-design-system-community/clippy-components/clippy-content-select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { arrayFromTokenList } from '@nl-design-system-community/clippy-components/lib/converters';
import '@nl-design-system-community/clippy-components/clippy-content-select';
import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../wizard-story-example';
import { t } from '../../i18n';
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
  // Value of the story meta's `parameters.presets`, e.g. `ams.page-header`
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

  protected override async willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('components')) {
      await this.#loadPresetStories();
      return;
    }

    if (changedProperties.has('paths')) {
      this.#recomputeMatches();
    }
  }

  async #loadPresetStories() {
    const run = ++this.#loadRun;
    const loadedComponents = await loadComponentStories(this.components);
    if (run !== this.#loadRun) {
      return;
    }

    this.#presetStories = loadedComponents.flatMap(({ meta, stories }) => {
      const folder = meta.parameters?.['presets'];
      // Story with `parameters.presetStory: true`, falling back to the first story
      const [, story] = stories.find(([, story]) => story.parameters?.['presetStory'] === true) ?? stories[0] ?? [];
      return typeof folder === 'string' && story ? [{ folder, meta, story }] : [];
    });
    this.#recomputeMatches();
  }

  #recomputeMatches() {
    // Dedupe folders matched by more than one path
    const relevantFolders = new Map(
      (this.paths ?? []).flatMap((path) => getRelevantPresetFolders(path)).map((folder) => [folder.folder, folder]),
    );
    this.presetMatches = [...relevantFolders.values()].flatMap(({ folder, presets }) =>
      this.#presetStories
        .filter((presetStory) => presetStory.folder === folder)
        .map((presetStory) => ({ ...presetStory, presets })),
    );
    this.hidden = this.presetMatches.length === 0;
  }

  #handlePresetChange(event: Event, { folder, presets }: PresetMatch) {
    const value = String((event.currentTarget as ClippyContentSelect).value ?? PLACEHOLDER_VALUE);
    this.selectedPresets = { ...this.selectedPresets, [folder]: value };

    const preset = presets.find(({ name }) => name === value);
    if (!preset) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<ApplyTokenPresetDetail>(APPLY_TOKEN_PRESET_EVENT, {
        bubbles: true,
        composed: true,
        detail: { tokens: preset.tokens },
      }),
    );
  }

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
