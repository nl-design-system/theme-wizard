import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles';

const tag = 'clippy-story-preview';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyStoryPreview;
  }
}

/**
 * A web component to render any sort of content into that very recognizable Storybook-like
 * white, rounded rectangle with a small box-shadow. Perfect for small demos.
 */
@customElement(tag)
export class ClippyStoryPreview extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String }) size: string | undefined;

  override render() {
    return html`
      <div class="clippy-story-preview ${classMap({ 'clippy-story-preview--lg': this.size === 'lg' })}">
        <slot></slot>
      </div>
    `;
  }
}
