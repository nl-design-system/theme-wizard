import { safeCustomElement } from '@lib/decorators';
import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { DisplayToken } from './types';

const tag = 'clippy-token-detail';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenDetail;
  }
}

@safeCustomElement(tag)
export class ClippyTokenDetail extends LitElement {
  @property({ type: Object })
  token: DisplayToken | undefined = undefined;

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';

  renderTokenExample() {
    // switch (this.token?.tokenType) {
    //   case 'color':
    //     return html`<clippy-color-sample color=${this.token.displayValue}></clippy-color-sample>`;
    //   case 'fontSize':
    //     return html`<wizard-font-sample size=${this.token.displayValue} truncate></wizard-font-sample>`;
    //   case 'fontFamily':
    //     return html`<wizard-font-sample
    //       family=${this.token.displayValue}
    //       size="var(--basis-text-font-size-xl)"
    //       truncate
    //     ></wizard-font-sample>`;
    //   case 'dimension':
    //     return renderSpacingExample(this.token.displayValue, this.token.metadata?.['space']);
    //   default:
    //     return nothing;
    // }
    return html`<mark>Samples</mark>`;
  }

  override render() {
    console.log('this.token', this.token);
    if (!this.token) return html`<p>No token provided.</p>`;

    return html`
      <clippy-heading level=${3} data-testid="example-label">${this.exampleLabel}</clippy-heading>
      ${this.renderTokenExample()}
      <dl>
        <dt>Token type</dt>
        <dd>
          <code class="nl-code">color</code>
        </dd>
        <dt>Token ID</dt>
        <dd>
          <span class="nl-data-badge">${this.token.tokenId}</span>
        </dd>
        <dt>CSS Variable</dt>
        <dd>
          <code class="nl-code">${`--${this.token.tokenId.replaceAll('.', '-')}`}</code>
        </dd>
        <dt data-testid="value-label">${this.valueLabel}</dt>
        <dd>
          <code class="nl-code">${this.token.displayValue}</code>
        </dd>
        ${
          this.token.metadata
            ? Object.entries(this.token.metadata).map(
                ([key, value]) => html`
                  <dt>${key}</dt>
                  <dd>
                    <code class="nl-code">${value}</code>
                  </dd>
                `,
              )
            : nothing
        }
      </dl>

      <clippy-heading level=${3}>
        <span data-testid="reference-title-label">${this.referenceTitleLabel}</span>
        <data>(${this.token.usage.length}&times;)</data>
      </clippy-heading>

      ${
        this.token.usage.length > 0
          ? html`
              <ul>
                ${this.token.usage.map(
                  (referrer) => html`
                    <li>
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
    `;
  }
}
