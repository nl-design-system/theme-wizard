import { safeCustomElement } from '@lib/decorators';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import descriptionListCss from '@utrecht/data-list-css/dist/index.css?inline';
import unorderedListCss from '@utrecht/unordered-list-css/dist/index.css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import srOnly from '../lib/sr-only';
import styles from './styles';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-heading';
import '../clippy-stack';
import { DisplayToken } from './types';

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
    styles,
    srOnly,
  ];

  @property({ type: Object })
  token: DisplayToken | undefined = undefined;

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';

  renderTokenExample() {
    switch (this.token?.tokenType) {
      case 'color':
        return html`<clippy-color-sample color=${this.token.displayValue}></clippy-color-sample>`;
      case 'fontSize':
        return html`<clippy-token-sample-text
          font-size=${this.token.displayValue}
          truncate
        ></clippy-token-sample-text>`;
      case 'fontFamily':
        return html`<clippy-token-sample-text
          font-family=${this.token.displayValue}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'fontWeight':
        return html`<clippy-token-sample-text
          font-weight=${this.token.displayValue}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'lineHeight':
        return html`<clippy-token-sample-text
          line-height=${this.token.displayValue}
          font-size="var(--basis-text-font-size-xl)"
        ></clippy-token-sample-text>`;
      case 'dimension':
        return html`<clippy-token-sample-spacing
          size=${this.token.displayValue}
          concept=${this.token.metadata?.['concept']}
        ></clippy-token-sample-spacing>`;
      default:
        return nothing;
    }
  }

  override render() {
    if (!this.token) return html`<p>No token provided.</p>`;

    return html`
      <clippy-stack size="2xl">
        <clippy-stack>
          <clippy-heading level=${3} data-testid="example-label">${this.exampleLabel}</clippy-heading>
          ${this.renderTokenExample()}
          <dl class="utrecht-data-list utrecht-data-list--html-dl utrecht-data-list--rows">
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">Token type</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">color</code>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">Token ID</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <span class="nl-data-badge">${this.token.tokenId}</span>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key">CSS Variable</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">${`--${this.token.tokenId.replaceAll('.', '-')}`}</code>
              </dd>
            </div>
            <div class="utrecht-data-list__item">
              <dt class="utrecht-data-list__item-key" data-testid="value-label">${this.valueLabel}</dt>
              <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                <code class="nl-code">${this.token.displayValue}</code>
              </dd>
            </div>
            ${
              this.token.metadata
                ? Object.entries(this.token.metadata).map(
                    ([key, value]) => html`
                      <div class="utrecht-data-list__item">
                        <dt class="utrecht-data-list__item-key">${key}</dt>
                        <dd class="utrecht-data-list__item-value utrecht-data-list__item-value--html-dd">
                          <code class="nl-code">${value}</code>
                        </dd>
                      </div>
                    `,
                  )
                : nothing
            }
          </dl>
        </clippy-stack>

        <clippy-stack>
          <clippy-heading level=${3}>
            <span data-testid="reference-title-label">${this.referenceTitleLabel}</span>
            <data>(${this.token.usage.length}&times;)</data>
          </clippy-heading>

          ${
            this.token.usage.length > 0
              ? html`
                  <ul class="utrecht-unordered-list" role="list">
                    ${this.token.usage.map(
                      (referrer) => html`
                        <li class="utrecht-unordered-list__item">
                          <span class="nl-data-badge">${referrer}</span>
                        </li>
                      `,
                    )}
                  </ul>
                `
              : html`
                  <utrecht-paragraph data-testid="reference-empty-label">${this.referenceEmptyLabel}</utrecht-paragraph>
                `
          }
        </clippy-stack>
      </clippy-stack>
    `;
  }
}
