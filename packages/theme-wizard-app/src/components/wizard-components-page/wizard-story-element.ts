import type { Meta, StoryObj } from '@storybook/react-vite';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import './wizard-story-react-element';

const tag = 'wizard-story-element';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryElement;
  }
}

/**
 * Framework-agnostic dispatcher for rendering Component Story Format (CSF) stories.
 * Currently renders React stories via wizard-story-react-element.
 * In the future, can be extended to support other frameworks (Vue, Svelte, etc.).
 */
export class WizardStoryElement extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) meta: Meta<any> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) story: StoryObj<any> | null = null;

  override render() {
    // TODO: In the future, detect framework from meta/story and render accordingly
    // if (isReact(this.meta)) {
    //   return html`<wizard-story-react-element ...></wizard-story-react-element>`;
    // } else if (isVue(this.meta)) {
    //   return html`<wizard-story-vue-element ...></wizard-story-vue-element>`;
    // }
    // For now, always render React stories
    return html` <wizard-story-react-element .meta=${this.meta} .story=${this.story}></wizard-story-react-element> `;
  }
}

customElements.define(tag, WizardStoryElement);
