import type { ClippyContentSelect } from '@nl-design-system-community/clippy-components/clippy-content-select';
import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-content-select';
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import '@nl-design-system-community/clippy-components/clippy-theme-provider';
import { mergeTokens, type TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { StoryRenderProps } from '../wizard-story-react';
import '../wizard-story-react';
import { themeContext } from '../../contexts/theme';
import { StoryBaseThemeStyles, getStoryBaseTheme, renderWithStoryBaseTheme } from '../../utils/story-base-theme';
import styles from './styles';

const tag = 'wizard-story-presets';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryPresets;
  }
}

export type StoryPreset = {
  label: string;
  value: string;
  // Overrides on top of the live theme, e.g. basis colors pointing at their inverse variant
  tokens: TokenGroup;
};

/**
 * Renders a story in the live theme, with a select to preview it under different token presets.
 */
@customElement(tag)
export class WizardStoryPresets extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ attribute: false }) story: StoryRenderProps['story'] = undefined;
  @property({ attribute: false }) componentMeta: StoryRenderProps['componentMeta'] = undefined;
  @property({ attribute: false }) presets: StoryPreset[] = [];
  @property() label = '';

  @state() private selectedPresetValue: string | undefined;
  @state() private presetTheme: ReturnType<typeof mergeTokens> = {};

  readonly #baseThemeStyles = new StoryBaseThemeStyles();

  get #selectedPreset(): StoryPreset | undefined {
    return this.presets.find(({ value }) => value === this.selectedPresetValue) ?? this.presets[0];
  }

  protected override willUpdate(changedProperties: PropertyValues) {
    if (
      changedProperties.has('theme') ||
      changedProperties.has('presets') ||
      changedProperties.has('selectedPresetValue')
    ) {
      // The full theme is needed, not only the overrides: component tokens referencing basis tokens are
      // resolved where they're declared, so they must be declared again inside the preset provider.
      this.presetTheme = mergeTokens([structuredClone(this.theme.tokens), this.#selectedPreset?.tokens ?? {}]);
    }
  }

  #handlePresetChange(event: Event) {
    this.selectedPresetValue = String((event.currentTarget as ClippyContentSelect).value);
  }

  override render() {
    if (!this.story || !this.componentMeta) {
      return nothing;
    }

    const baseTheme = getStoryBaseTheme(this.componentMeta);
    this.#baseThemeStyles.adopt(this.shadowRoot, baseTheme);

    return html`
      <clippy-reset-theme>
        ${renderWithStoryBaseTheme(
          baseTheme,
          html`
            <clippy-theme-provider .theme=${this.theme.tokens}>
              <clippy-content-select
                hidden-label=${this.label}
                .options=${this.presets.map(({ label, value }) => ({ label, value }))}
                .value=${this.#selectedPreset?.value ?? null}
                @change=${this.#handlePresetChange}
              >
                <clippy-theme-provider .theme=${this.presetTheme}>
                  <wizard-story-react
                    .story=${this.story}
                    .componentMeta=${this.componentMeta}
                    .args=${this.story.args ?? {}}
                  ></wizard-story-react>
                </clippy-theme-provider>
              </clippy-content-select>
            </clippy-theme-provider>
          `,
        )}
      </clippy-reset-theme>
    `;
  }
}
