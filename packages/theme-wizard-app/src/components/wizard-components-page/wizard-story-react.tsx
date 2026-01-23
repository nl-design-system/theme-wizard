import type { Meta, StoryObj } from '@storybook/react-vite';
import { consume } from '@lit/context';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import { LitElement, unsafeCSS } from 'lit';
import { state, property } from 'lit/decorators.js';
import React, { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-story-react';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryReact;
  }
}

/**
 * Render a React component from Component Story Format (CSF).
 * Accepts a .meta property (default export of CSF) and a .story property (a Story object).
 * Uses `any` for component types to support framework-agnostic story rendering.
 */
export class WizardStoryReact extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) meta: Meta<any> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) story: StoryObj<any> | null = null;

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  protected _renderRoot: Root | null = null;

  // TODO: this is a hard to scale solution for the scoped styles
  static override readonly styles = [unsafeCSS(markCSS), unsafeCSS(linkCSS), unsafeCSS(codeCSS)];

  override connectedCallback() {
    super.connectedCallback();
    if (this.shadowRoot && !this._renderRoot) {
      const container = document.createElement('div');
      container.classList.add('theme-preview');
      this.shadowRoot.appendChild(container);
      this._renderRoot = createRoot(container);
    }

    this.shadowRoot?.adoptedStyleSheets.push(this.theme.stylesheet);
  }

  override render() {
    if (!this.meta?.component || !this._renderRoot) {
      return;
    }

    // Make React available globally for story render functions that use JSX
    globalThis.React = React;

    const Component = this.meta.component as ComponentType<unknown>;
    const defaultArgs = this.meta.args || {};
    const args = {
      ...defaultArgs,
      ...this.story?.args,
    };

    // If story has a custom render function, use it
    if (this.story && typeof this.story.render === 'function') {
      let componentRendering: ReactNode;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        componentRendering = (this.story.render as any)(args, {
          component: Component,
        });
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error(error);
      }

      this._renderRoot.render(componentRendering);
    } else {
      // Use the default renderer with merged args
      let componentRendering: ReactNode;

      try {
        componentRendering = createElement(Component as never, args);
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error(error);
      }

      this._renderRoot.render(componentRendering);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._renderRoot?.unmount();
    this._renderRoot = null;
  }
}

customElements.define(tag, WizardStoryReact);
