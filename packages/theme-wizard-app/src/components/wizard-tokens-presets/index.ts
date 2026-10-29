import type { ClippyContentSelect } from '@nl-design-system-community/clippy-components/clippy-content-select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-content-select';
import { SKIP, walkTokens } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../wizard-story-example';
import { t } from '../../i18n';
import { loadComponentStories, type ComponentStoriesRegistry } from '../../utils/component-stories';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
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
 * Renders a preset select with story preview for every component preset folder relevant to `path`.
 * Choosing a preset dispatches `update-design-tokens` so wizard-app applies it to the theme.
 */
@customElement(tag)
export class WizardTokensPresets extends LitElement {
  static override readonly styles = [styles];

  // Token path of the current page, e.g. `basis.color.accent-1`
  @property() path = '';

  // Caller-supplied registry of components; stories opt in with `parameters.presets`
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

    if (changedProperties.has('path')) {
      this.#recomputeMatches();
    }
  }

  async #loadPresetStories() {
    const run = ++this.#loadRun;
    const loadedComponents = await loadComponentStories(this.components);
    if (run !== this.#loadRun) {
      return;
    }

    this.#presetStories = loadedComponents.flatMap(({ meta, stories: [firstStory] }) => {
      const folder = meta.parameters?.['presets'];
      return typeof folder === 'string' && firstStory ? [{ folder, meta, story: firstStory[1] }] : [];
    });
    this.#recomputeMatches();
  }

  #recomputeMatches() {
    this.presetMatches = getRelevantPresetFolders(this.path).flatMap(({ folder, presets }) =>
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
    const tokens: UpdateDesignTokensDetail['tokens'] = [];
    walkTokens(preset.tokens, (token, path) => {
      tokens.push({ path: path.join('.'), type: token.$type, value: token.$value });
      return SKIP;
    });
    this.dispatchEvent(
      new CustomEvent<UpdateDesignTokensDetail>(UPDATE_DESIGN_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail: { tokens },
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
