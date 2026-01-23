import { property } from 'lit/decorators.js';
import React, { type ReactNode, type ComponentType } from 'react';
import { WizardReactElement, type JsxChangeEvent } from './wizard-react-element';

const tag = 'wizard-story-react-element';

interface StoryConfig {
  args?: Record<string, unknown>;
  render?: (args: Record<string, unknown>, context: { component: ComponentType<unknown> }) => ReactNode;
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryReactElement;
  }
}

/**
 * Render a React component as a web component, with story and defaultArgs as properties.
 * Extends WizardReactElement to handle Storybook-style story render functions.
 */
export class WizardStoryReactElement extends WizardReactElement {
  @property({ type: Object }) story: StoryConfig | null = null;
  @property({ type: Object }) defaultArgs: object = {};

  override render() {
    if (!this.Component || !this._renderRoot) {
      return;
    }

    // Make React available globally for story render functions that use JSX
    globalThis.React = React;

    const args = {
      ...this.defaultArgs,
      ...this.story?.args,
    };

    // If story has a custom render function, use it
    if (this.story && typeof this.story.render === 'function') {
      let componentRendering: ReactNode;
      try {
        componentRendering = this.story.render(args, {
          component: this.Component,
        });
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error(error);
      }

      const evt = new CustomEvent('change', {
        detail: {
          jsx: componentRendering,
        },
      } satisfies JsxChangeEvent);

      if (typeof this.jsxChange === 'function') {
        this.jsxChange(evt);
      }

      this.dispatchEvent(evt);
      this._renderRoot.render(componentRendering);
    } else {
      // Otherwise use base class rendering with merged args
      this.props = args;
      super.render();
    }
  }
}

customElements.define(tag, WizardStoryReactElement);
