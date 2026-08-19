import { safeCustomElement } from '@lib/decorators';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import {
  getTokenColor,
  getTokenDimensionSpaceConcept,
  getTokenPath,
  getTokenReferenceCount,
  getTokenReferencedAt,
  getTokenSubType,
  getTokenValue,
} from '@src/lib/tokens';
import descriptionListCss from '@utrecht/data-list-css/dist/index.css?inline';
import unorderedListCss from '@utrecht/unordered-list-css/dist/index.css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-heading';
import '../clippy-stack';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-token-detail';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenDetail;
  }
}

@safeCustomElement(tag)
export class ClippyTokenDetail extends LitElement {
  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(codeCss),
    unsafeCSS(descriptionListCss),
    unsafeCSS(unorderedListCss),
    unsafeCSS(paragraphCss),
    styles,
    srOnly,
  ];

  @property({ type: Object })
  token?: BaseDesignToken;

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';

  renderTokenExample() {
    if (!this.token) return nothing;
    switch (this.token.$type) {
      case 'color':
        return html`<clippy-color-sample color=${getTokenColor(this.token)}></clippy-color-sample>`;
      case 'dimension': {
        const subType = getTokenSubType(this.token);
        switch (subType) {
          case 'font-size':
            return html`<clippy-token-sample-text
              font-size=${getTokenValue(this.token)}
              truncate
            ></clippy-token-sample-text>`;
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return html`<clippy-token-sample-spacing
              size=${getTokenValue(this.token)}
              concept=${getTokenDimensionSpaceConcept(this.token)}
            ></clippy-token-sample-spacing>`;
          case 'border-width':
            return html`<clippy-token-sample-border width=${getTokenValue(this.token)}></clippy-token-sample-border>`;
          case 'border-radius':
            return html`<clippy-token-sample-border
              border-radius=${getTokenValue(this.token)}
            ></clippy-token-sample-border>`;
          default:
            return nothing;
        }
      }
      // TODO: Google fonts?
      case 'fontFamily':
        return html`<clippy-token-sample-text
          font-family=${getTokenValue(this.token)}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'number': {
        const subType = getTokenSubType(this.token);
        switch (subType) {
          case 'font-weight':
            return html`<clippy-token-sample-text
              font-weight=${getTokenValue(this.token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text
              line-height=${getTokenValue(this.token)}
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

  renderTokenExtras() {
    if (!this.token) return nothing;
    switch (this.token.$type) {
      case 'color': {
        const color = getTokenColor(this.token);
        return html`
          <div class="utrecht-data-list__item">
            <dt class="utrecht-data-list__item-key">OKLCH</dt>
            <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
              <code class="nl-code">${color?.toString({ format: 'oklch' })}</code>
            </dd>
          </div>
          <div class="utrecht-data-list__item">
            <dt class="utrecht-data-list__item-key">P3 Color</dt>
            <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
              <code class="nl-code">${color?.toString({ format: 'color' })}</code>
            </dd>
          </div>
          <div class="utrecht-data-list__item">
            <dt class="utrecht-data-list__item-key">RGB</dt>
            <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
              <code class="nl-code">${color?.toString({ format: 'rgb' })}</code>
            </dd>
          </div>
        `;
      }
      default:
        return nothing;
    }
  }

  override render() {
    if (!this.token) return nothing;

    const tokenPath = getTokenPath(this.token);
    const referencedAt = getTokenReferencedAt(this.token);
    const referenceCount = getTokenReferenceCount(this.token);
    return html`
      <clippy-stack size="2xl">
        <clippy-stack>
          <clippy-heading level=${3} data-testid="example-label">${this.exampleLabel}</clippy-heading>
          ${this.renderTokenExample()}
          <dl class="utrecht-data-list utrecht-data-list--html-dl utrecht-data-list--rows">
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">Token type</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">${this.token.$type}</code>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">Token ID</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <span class="nl-data-badge">${tokenPath}</span>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">CSS Variable</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">${`--${tokenPath.replaceAll('.', '-')}`}</code>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key" data-testid="value-label">${this.valueLabel}</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">${getTokenValue(this.token)}</code>
              </dd>
            </div>
            ${this.renderTokenExtras()}
          </dl>
        </clippy-stack>

        <clippy-stack>
          <clippy-heading level=${3}>
            <span data-testid="reference-title-label">${this.referenceTitleLabel}</span>
            <data>(${referenceCount}&times;)</data>
          </clippy-heading>

          ${
            referencedAt.length > 0
              ? html`
                  <ul class="utrecht-unordered-list" role="list">
                    ${referencedAt.map(
                      (referrer) => html`
                        <li class="utrecht-unordered-list__item">
                          <span class="nl-data-badge">${referrer}</span>
                        </li>
                      `,
                    )}
                  </ul>
                `
              : html` <p class="nl-paragraph" data-testid="reference-empty-label">${this.referenceEmptyLabel}</p> `
          }
        </clippy-stack>
      </clippy-stack>
    `;
  }
}
