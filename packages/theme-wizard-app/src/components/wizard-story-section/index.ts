import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-story-preview';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-story-example';
import type { StoryRenderProps } from '../wizard-story-react';
import styles from './styles';

const tag = 'wizard-story-section';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStorySection;
  }
}

@customElement(tag)
export class WizardStorySection extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) heading = '';
  @property({ attribute: 'heading-level', type: Number }) headingLevel = 3;

  story: StoryRenderProps['story'] = undefined;
  componentMeta: StoryRenderProps['componentMeta'] = undefined;
  args: StoryRenderProps['args'] = undefined;

  override render() {
    return html`
      <section>
        <clippy-heading level=${this.headingLevel}>${this.heading}</clippy-heading>
        <clippy-story-preview>
          <wizard-story-example
            .story=${this.story}
            .componentMeta=${this.componentMeta}
            .args=${this.args}
          ></wizard-story-example>
        </clippy-story-preview>
      </section>
    `;
  }
}
