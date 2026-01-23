import type { Meta, StoryObj } from '@storybook/react-vite';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import './wizard-story-react';

const tag = 'wizard-story';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStory;
  }
}

/**
 * Framework-agnostic dispatcher for rendering Component Story Format (CSF) stories.
 * Currently renders React stories via wizard-story-react.
 * In the future, can be extended to support other frameworks (Vue, Svelte, etc.).
 */
export class WizardStory extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) meta: Meta<any> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) story: StoryObj<any> | null = null;

  override render() {
    // TODO: In the future, detect framework from meta/story and render accordingly
    // if (isReact(this.meta)) {
    //   return html`<wizard-story-react ...></wizard-story-react>`;
    // } else if (isVue(this.meta)) {
    //   return html`<wizard-story-vue ...></wizard-story-vue>`;
    // }
    // For now, always render React stories
    return html` <wizard-story-react .meta=${this.meta} .story=${this.story}></wizard-story-react> `;
  }
}

customElements.define(tag, WizardStory);
