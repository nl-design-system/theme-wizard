import { html, LitElement, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { safeCustomElement } from '@lib/decorators';
import styles from './styles';

const tag = 'clippy-theme-context';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyThemeContext;
  }
  interface HTMLElementEventMap {
    'theme-change': CustomEvent<{ tokens: unknown }>;
  }
}

/**
 * A plain data bridge: holds a JSON-serialized value (e.g. design tokens) as an
 * attribute so consumers outside the light DOM tree can read or listen for it
 * without speaking `@lit/context` or the `context-request` protocol themselves.
 * Renders nothing — a parent is expected to keep `theme` in sync.
 */
@safeCustomElement(tag)
export class ClippyThemeContext extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) theme: string | undefined;

  get tokens(): unknown {
    if (!this.theme) return undefined;
    try {
      return JSON.parse(this.theme);
    } catch {
      return undefined;
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('theme')) {
      this.dispatchEvent(
        new CustomEvent('theme-change', { bubbles: true, composed: true, detail: { tokens: this.tokens } }),
      );
    }
  }

  override render() {
    return html``;
  }
}
