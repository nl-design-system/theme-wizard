import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-token-preset-selector';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenPresetSelector;
  }
}

/**
 * Clippy Token Preset Selector Component
 */
@safeCustomElement(tag)
export class ClippyTokenPresetSelector extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`clippy-token-preset-selector`;
  }
}
