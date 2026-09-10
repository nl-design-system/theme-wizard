import { safeCustomElement } from '@lib/decorators';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { BaseDesignToken, getTokenSubtype, isRef } from '@nl-design-system-community/design-tokens-schema';
import {
  getTokenColor,
  getTokenDimensionSpaceConcept,
  getTokenPath,
  getTokenReferenceCount,
  getTokenReferencedAt,
  stringifyReferenceValue,
  stringifyTokenValue,
} from '@src/lib/tokens';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import descriptionListCss from '@utrecht/data-list-css/dist/index.css?inline';
import unorderedListCss from '@utrecht/unordered-list-css/dist/index.css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import '../clippy-token-sample';
import '../clippy-heading';
import '../clippy-stack';
import '../clippy-toggletip';
import { property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-token-detail';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenDetail;
  }
}

/**
 * Clippy Token Detail Component
 *
 * @cssprop --clippy-token-detail-color - Color of the text
 * @cssprop --clippy-token-detail-font-family - Font family of the text
 * @cssprop --clippy-token-detail-font-size - Font size of the text
 * @cssprop --clippy-token-detail-line-height - Line height of the text
 * @cssprop --clippy-token-detail-key-color - Color of the key text
 * @cssprop --clippy-token-detail-key-font-weight - Font weight of the key text
 */
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
  @property({ attribute: 'reference-to-label', type: String }) referenceToLabel = 'Reference to';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';
  @property({ attribute: 'copy-to-clipboard-label', type: String }) copyToClipboardLabel = 'Copy to clipboard: ';

  #renderDefinition({
    copyable,
    definition,
    isBadge,
    term,
    testId,
  }: {
    term: string;
    definition: string;
    testId: string;
    isBadge?: boolean;
    copyable?: boolean;
  }) {
    return html` <div class="utrecht-data-list__item" data-testid="${testId}">
      <dt class="utrecht-data-list__item-key" data-testid="term">${term}</dt>
      <dd
        class="clippy-token-detail__definition | utrecht-data-list__item-value utrecht-data-list__item-value--html-dd"
      >
        ${isBadge ? html`<span class="nl-data-badge" data-testid="definition">${definition}</span>` : html`<code class="nl-code" data-testid="definition">${definition}</code>`}
        ${
          copyable
            ? html`<clippy-toggletip text=${`${this.copyToClipboardLabel}${definition}`}>
                <clippy-button
                  icon-only
                  purpose="subtle"
                  size="small"
                  @click=${() => navigator.clipboard.writeText(definition)}
                >
                  ${this.copyToClipboardLabel}${definition}
                  <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                </clippy-button>
              </clippy-toggletip>`
            : nothing
        }
      </dd>
    </div>`;
  }

  /**
   * Some token types have some extra information to show
   */
  #renderTokenExtras() {
    if (!this.token) return nothing;
    switch (this.token.$type) {
      case 'color': {
        const color = getTokenColor(this.token);
        return html`
          ${this.#renderDefinition({
            copyable: true,
            definition: color?.toString({ format: 'oklch' }) as string,
            term: 'OKLCH',
            testId: 'token-oklch-value',
          })}
          ${this.#renderDefinition({
            copyable: true,
            definition: color?.toString({ format: 'color' }) as string,
            term: 'P3 Color',
            testId: 'token-p3-value',
          })}
          ${this.#renderDefinition({
            copyable: true,
            definition: color?.toString({ format: 'rgb' }) as string,
            term: 'RGB',
            testId: 'token-rgb-value',
          })}
        `;
      }
      case 'dimension': {
        const subType = getTokenSubtype(this.token);
        switch (subType) {
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return this.#renderDefinition({
              definition: getTokenDimensionSpaceConcept(this.token) as string,
              term: 'Spacing concept',
              testId: 'token-spacing-concept',
            });

          default:
            return nothing;
        }
      }
      default:
        return nothing;
    }
  }

  override render() {
    if (!this.token) return nothing;
    const token = this.token;

    const tokenPath = getTokenPath(token);
    const cssVariable = tokenPath ? `--${tokenPath.replaceAll('.', '-')}` : '';
    const referencedAt = getTokenReferencedAt(token);
    const referenceCount = getTokenReferenceCount(token);
    return html`
      <clippy-stack size="2xl">
        <clippy-stack>
          <clippy-heading level=${3} data-testid="example-label">${this.exampleLabel}</clippy-heading>
          <clippy-token-sample .token=${token}></clippy-token-sample>
          <dl class="utrecht-data-list utrecht-data-list--html-dl utrecht-data-list--rows">
            ${this.#renderDefinition({
              definition: token.$type,
              term: 'Token type',
              testId: 'token-type',
            })}
            ${
              tokenPath
                ? html`
                    ${this.#renderDefinition({
                      copyable: true,
                      definition: tokenPath,
                      isBadge: true,
                      term: 'Token ID',
                      testId: 'token-id',
                    })}
                    ${this.#renderDefinition({
                      copyable: true,
                      definition: cssVariable,
                      term: 'CSS Variable',
                      testId: 'token-css-variable',
                    })}
                  `
                : nothing
            }
            ${
              isRef(token.$value)
                ? this.#renderDefinition({
                    copyable: true,
                    definition: stringifyReferenceValue(token),
                    isBadge: true,
                    term: this.referenceToLabel,
                    testId: 'reference-to-label',
                  })
                : nothing
            }
            ${this.#renderDefinition({
              copyable: true,
              definition: stringifyTokenValue(token),
              term: this.valueLabel,
              testId: 'token-value',
            })}
            ${this.#renderTokenExtras()}
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
