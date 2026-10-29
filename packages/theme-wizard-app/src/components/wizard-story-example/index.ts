import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import '@nl-design-system-community/clippy-components/clippy-theme-provider';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { StoryRenderProps } from '../wizard-story-react';
import '../wizard-story-react';
import { themeContext } from '../../contexts/theme';
import { StoryBaseThemeStyles, getStoryBaseTheme, renderWithStoryBaseTheme } from '../../utils/story-base-theme';
import styles from './styles';

const tag = 'wizard-story-example';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryExample;
  }
}

/**
 * Renders a single Storybook-like story inside a reset + the live theme.
 */
@customElement(tag)
export class WizardStoryExample extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  story: StoryRenderProps['story'] = undefined;
  componentMeta: StoryRenderProps['componentMeta'] = undefined;
  args: StoryRenderProps['args'] = undefined;

  readonly #baseThemeStyles = new StoryBaseThemeStyles();

  protected override willUpdate() {
    this.#baseThemeStyles.adopt(this.shadowRoot, getStoryBaseTheme(this.componentMeta));
  }

  override render() {
    const baseTheme = getStoryBaseTheme(this.componentMeta);

    return html`
      <clippy-reset-theme>
        ${renderWithStoryBaseTheme(
          baseTheme,
          html`
            <clippy-theme-provider .theme=${this.theme.tokens}>
              <wizard-story-react
                .story=${this.story}
                .componentMeta=${this.componentMeta}
                .args=${this.args ?? this.story?.args ?? {}}
              ></wizard-story-react>
            </clippy-theme-provider>
          `,
        )}
      </clippy-reset-theme>
    `;
  }
}
