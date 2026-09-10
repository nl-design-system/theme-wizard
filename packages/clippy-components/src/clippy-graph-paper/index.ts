import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-graph-paper';

/**
 * Clippy Graph Paper Component
 *
 * @slot - Default slot for content
 *
 * @cssprop [--clippy-graph-paper-cell-size] - Size of one grid cell
 * @cssprop [--clippy-graph-paper-line-size] - Thickness of the grid lines
 * @cssprop [--clippy-graph-paper-minor-line-color] - Color of the minor (per-cell) grid lines
 * @cssprop [--clippy-graph-paper-major-line-color] - Color of the major grid lines
 * @cssprop [--clippy-graph-paper-major-line-interval] - Number of cells between major grid lines
 */
@safeCustomElement(tag)
export class ClippyGraphPaper extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyGraphPaper;
  }
}
