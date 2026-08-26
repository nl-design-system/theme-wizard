import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { BaseDesignToken, getTokenSubtype, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import '../clippy-color-sample';
import '../clippy-modal';
import '../clippy-token-detail';
import { safeCustomElement } from '@src/lib/decorators';
import { getTokenDimensionSpaceConcept, getTokenPath } from '@src/lib/tokens';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import srOnly from '../lib/sr-only';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-token-sample-border';
import '../clippy-graph-paper';
import styles from './styles';

const tag = 'clippy-token-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenTable;
  }
}

@safeCustomElement(tag)
export class ClippyTokenTable extends LitElement {
  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(codeCss), styles, srOnly];

  @property({ type: Object })
  tokens?: BaseDesignToken[];

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'token-id-label', type: String }) tokenIdLabel = 'Token ID';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'details-label', type: String }) detailsLabel = 'Details';

  #renderTokenExample({ token }: { token: BaseDesignToken }) {
    if (!token) {
      return nothing;
    }
    switch (token.$type) {
      case 'color':
        return html`<clippy-color-sample color=${stringifyToken(token)}></clippy-color-sample>`;
      case 'dimension': {
        // dimensions have a lot of different subtypes
        const subType = getTokenSubtype(token);
        switch (subType) {
          case 'font-size':
            return html`<clippy-token-sample-text
              font-size=${stringifyToken(token)}
              truncate
            ></clippy-token-sample-text>`;
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return html`<clippy-token-sample-spacing
              size=${stringifyToken(token)}
              concept=${getTokenDimensionSpaceConcept(token)}
            ></clippy-token-sample-spacing>`;
          case 'border-width':
            return html`<clippy-token-sample-border
              border-width=${stringifyToken(token)}
            ></clippy-token-sample-border>`;
          case 'border-radius':
            return html`<clippy-token-sample-border
              border-radius=${stringifyToken(token)}
            ></clippy-token-sample-border>`;
          default:
            return nothing;
        }
      }
      // TODO: Google fonts?
      case 'fontFamily':
        return html`<clippy-token-sample-text
          font-family=${stringifyToken(token)}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'number': {
        const subType = getTokenSubtype(token);
        switch (subType) {
          case 'font-weight':
            return html`<clippy-token-sample-text
              font-weight=${stringifyToken(token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text
              line-height=${stringifyToken(token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          default:
            return nothing;
        }
      }
      default:
        return nothing;
    }
  }

  override render() {
    return html`
      <div role="table" class="clippy-token-table__table">
        <div role="row" class="clippy-token-table__header">
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.exampleLabel}
          </span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.tokenIdLabel}
          </span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">${this.valueLabel}</span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.detailsLabel}
          </span>
        </div>
        <div role="rowgroup" class="clippy-token-table__body">
          ${this.tokens?.map((token) => {
            const subType = getTokenSubtype(token);
            return html`
              <div role="row" class="clippy-token-table__row">
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.exampleLabel}
                  </span>
                  <clippy-graph-paper
                    class=${classMap({
                      'clippy-token-table__example': true,
                      'clippy-token-table__example--clean': subType === 'line-height',
                    })}
                  >
                    ${this.#renderTokenExample({ token })}
                  </clippy-graph-paper>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.tokenIdLabel}
                  </span>
                  <span class="nl-data-badge">${getTokenPath(token)}</span>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.valueLabel}
                  </span>
                  <code class="nl-code">${stringifyToken(token)}</code>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.detailsLabel}
                  </span>
                  <mark>details</mark>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
