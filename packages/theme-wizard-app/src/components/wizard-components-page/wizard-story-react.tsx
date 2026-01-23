import React, { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WizardStory } from './wizard-story';

const tag = 'wizard-story-react';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryReact;
  }
}

/**
 * React-specific CSF story renderer.
 * Extends WizardStory base class and handles both simple props and custom story render functions.
 */
export class WizardStoryReact extends WizardStory {
  protected _renderRoot: Root | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (this.shadowRoot && !this._renderRoot) {
      const container = document.createElement('div');
      container.classList.add('theme-preview');
      this.shadowRoot.appendChild(container);
      this._renderRoot = createRoot(container);
    }

    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets.push(this.theme.stylesheet);

      // Apply story styles from property
      if (this.storyStyleSheets) {
        this.shadowRoot.adoptedStyleSheets.push(...this.storyStyleSheets);
      }
    }
  }

  override render() {
    if (!this.meta?.component || !this.story || !this._renderRoot) {
      return;
    }

    const Component = this.meta.component as ComponentType<unknown>;
    const defaultArgs = this.meta.args || {};
    const args = {
      ...defaultArgs,
      ...this.story?.args,
    };

    let componentRendering: ReactNode;

    // Make React available globally for story render functions that use JSX
    globalThis.React = React;

    // Check if story has a custom render function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storyWithRender = this.story as any;
    if (storyWithRender?.render && typeof storyWithRender.render === 'function') {
      try {
        componentRendering = storyWithRender.render(args, {
          component: Component,
        });
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error(error);
      }
    } else {
      try {
        componentRendering = createElement(Component as never, args);
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error(error);
      }
    }

    this._renderRoot.render(componentRendering);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._renderRoot?.unmount();
    this._renderRoot = null;
  }
}

customElements.define(tag, WizardStoryReact);
