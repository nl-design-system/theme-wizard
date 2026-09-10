import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../wizard-preview-theme';
import '../wizard-story-react';
import type { StoryRenderProps } from '../wizard-story-react';
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

  story: StoryRenderProps['story'] = undefined;
  componentMeta: StoryRenderProps['componentMeta'] = undefined;
  args: StoryRenderProps['args'] = undefined;

  override render() {
    return html`
      <clippy-reset-theme>
        <wizard-preview-theme>
          <wizard-story-react
            .story=${this.story}
            .componentMeta=${this.componentMeta}
            .args=${this.args ?? this.story?.args ?? {}}
          ></wizard-story-react>
        </wizard-preview-theme>
      </clippy-reset-theme>
    `;
  }
}
