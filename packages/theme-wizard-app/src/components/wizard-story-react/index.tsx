import React, { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WizardStory } from '../wizard-story';

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
  protected _lastStory: unknown = null;
  protected _lastMeta: unknown = null;
  protected _lastStyleSheets: CSSStyleSheet[] | undefined = undefined;
  protected _containerShadowRoot: ShadowRoot | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (!this._renderRoot) {
      // Create a wrapper with shadow DOM for styling
      const wrapper = document.createElement('div');
      this.appendChild(wrapper);

      // Create shadow root on the wrapper to hold styles
      this._containerShadowRoot = wrapper.attachShadow({ mode: 'open' });

      // Create a container element inside the shadow DOM for React rendering
      const container = document.createElement('div');
      this._containerShadowRoot.appendChild(container);
      this._renderRoot = createRoot(container);

      // Apply theme stylesheet to shadow DOM
      if (this.theme?.stylesheet) {
        this._containerShadowRoot.adoptedStyleSheets.push(this.theme.stylesheet);
      }
    }
  }

  protected override createRenderRoot() {
    // Render light DOM - don't create shadow DOM
    return this;
  }

  protected override updated() {
    // Only re-render if story or meta actually changed
    if (this._lastStory !== this.story || this._lastMeta !== this.meta) {
      this._lastStory = this.story;
      this._lastMeta = this.meta;
      this.renderStory();
    }

    // Apply stylesheets if they changed
    if (this._lastStyleSheets !== this.storyStyleSheets && this._containerShadowRoot) {
      this._lastStyleSheets = this.storyStyleSheets;
      if (this.storyStyleSheets) {
        // Apply story stylesheets to the container shadow DOM
        this._containerShadowRoot.adoptedStyleSheets.push(...this.storyStyleSheets);
      }
    }
  }

  private renderStory() {
    if (!this.meta?.component || !this.story || !this._renderRoot) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = this.meta.component as any;
    const defaultArgs = this.meta.args || {};
    const args = {
      ...defaultArgs,
      ...this.story?.args,
    };

    let componentRendering;

    // Check if story has a custom render function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storyWithRender = this.story as any;
    if (storyWithRender?.render && typeof storyWithRender.render === 'function') {
      try {
        componentRendering = storyWithRender.render(args, {
          component: Component,
        });
      } catch (error) {
        componentRendering = 'Error in render function';
        console.error(error);
      }
    } else {
      try {
        // Try rendering the actual component with args
        componentRendering = createElement(Component, args);
      } catch (error) {
        console.error('Error creating component element:', error);
        componentRendering = 'Error creating element';
      }
    }

    try {
      this._renderRoot.render(componentRendering);
    } catch (error) {
      console.error('Sync error during render:', error);
    }
  }

  override render() {
    // Return nothing - Lit doesn't render anything, React renders in light DOM
    return undefined;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._renderRoot?.unmount();
    this._renderRoot = null;
  }
}

customElements.define(tag, WizardStoryReact);
