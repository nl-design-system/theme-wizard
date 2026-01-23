import type { Meta, StoryObj } from '@storybook/react-vite';
import { consume } from '@lit/context';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import { LitElement, unsafeCSS } from 'lit';
import { state, property } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-story';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStory;
  }
}

/**
 * Base class for rendering Component Story Format (CSF) stories.
 * Provides common properties and theme context consumption.
 * Subclasses implement framework-specific rendering (React, Vue, Svelte, etc.).
 */
export class WizardStory extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) meta: Meta<any> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) story: StoryObj<any> | null = null;

  @consume({ context: themeContext, subscribe: true })
  @state()
  protected readonly theme!: Theme;

  static override readonly styles = [unsafeCSS(markCSS), unsafeCSS(linkCSS), unsafeCSS(codeCSS)];
}

customElements.define(tag, WizardStory);
