import '../clippy-button';
import '../clippy-icon';
import '../clippy-toggletip';
import '../clippy-token-sample';
import {
  type BaseDesignToken,
  getRefChain,
  isTokenGroup,
  isTokenLike,
  stringifyToken,
  type TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import { stringifyTokenValue } from '@src/lib/tokens';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import dlv from 'dlv';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';

const tag = 'clippy-token-group-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenGroupTable;
  }
}

export type ValueDisplay = 'as-authored' | 'common' | 'brand' | 'resolved';

/**
 * Clippy Token Group Table Component
 *
 * Renders the token group at `path` of a full token tree as a table, including nested groups.
 */
@safeCustomElement(tag)
export class ClippyTokenGroupTable extends LitElement {
  static override readonly styles = [styles];

  /** Renders nothing while `null` or `undefined` */
  @property({ type: Object }) theme?: TokenGroup | null;
  @property({ type: String }) path = '';
  @property({ attribute: 'value-display', type: String }) valueDisplay: ValueDisplay = 'as-authored';

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'name-label', type: String }) nameLabel = 'Name';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'actions-label', type: String }) actionsLabel = 'Actions';
  @property({ attribute: 'copy-label', type: String }) copyLabel = 'Copy';

  #getGroupAtPath(theme: TokenGroup): TokenGroup {
    if (!this.path) {
      return theme;
    }
    const group: unknown = dlv(theme, this.path);
    return isTokenGroup(group) ? group : Object.create(null);
  }

  #renderTokenValue(token: BaseDesignToken): string {
    if (this.valueDisplay === 'as-authored') {
      return stringifyToken(token);
    }

    if (this.theme) {
      // Show the first `basis` token in the chain, or fall back to plain stringified token
      if (this.valueDisplay === 'common') {
        const breadcrumb = getRefChain(this.theme, token.$value);
        const basisToken = breadcrumb.find((token) => token.startsWith('{basis.'));
        return basisToken ?? stringifyToken(token);
      }

      // Show the first `brand` token in the chain, or fall back to plain stringified token
      if (this.valueDisplay === 'brand') {
        const breadcrumb = getRefChain(this.theme, token.$value);
        const firstBrandToken = breadcrumb.find((token) => token.startsWith('{brand.'));
        return firstBrandToken ?? stringifyToken(token);
      }
    }

    // Display resolved value
    return stringifyTokenValue(token);
  }

  readonly #renderTokenRow = (name: string, token: BaseDesignToken): TemplateResult => {
    const displayValue = this.#renderTokenValue(token);
    const resolvedValue = this.valueDisplay === 'resolved' ? displayValue : stringifyTokenValue(token);
    return html`
      <tr class="clippy-token-group-table__row">
        <td class="clippy-token-group-table__cell">
          <div class="clippy-token-group-table__token-sample">
            <clippy-token-sample .token=${token}>Aa</clippy-token-sample>
          </div>
        </td>
        <td class="clippy-token-group-table__cell">${name}</td>
        <td class="clippy-token-group-table__cell">${displayValue}</td>
        <td class="clippy-token-group-table__cell">
          <clippy-toggletip text=${`${this.copyLabel} "${resolvedValue}"`}>
            <clippy-button
              icon-only
              purpose="subtle"
              size="small"
              @click=${() => navigator.clipboard.writeText(resolvedValue)}
            >
              ${this.copyLabel} ${resolvedValue}
              <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
            </clippy-button>
          </clippy-toggletip>
        </td>
      </tr>
    `;
  };

  // TODO: Sort sub-groups and properties as per https://github.com/nl-design-system/documentatie/blob/main/docs/handboek/huisstijl-vastleggen/_design-tokens-volgorde.md
  readonly #renderTokenGroup = (name: string[], group: TokenGroup): TemplateResult => {
    return html`
      ${map(Object.entries(group), ([property, item]) => {
        if (isTokenLike(item)) {
          return this.#renderTokenRow(property, item);
        }
        if (isTokenGroup(item)) {
          const nestedProperty = name.concat(property);
          return html`
            <tr class="clippy-token-group-table__group-row">
              <td class="clippy-token-group-table__cell clippy-token-group-table__group-cell" colspan="4">
                ${nestedProperty.join('.')}
              </td>
            </tr>
            ${this.#renderTokenGroup(nestedProperty, item)}
          `;
        }
        return nothing;
      })}
    `;
  };

  override render() {
    if (!this.theme) {
      return nothing;
    }
    const group = this.#getGroupAtPath(this.theme);
    const rootPath = this.path ? [this.path] : [];

    return html`
      <table class="clippy-token-group-table__table">
        ${
          this.path
            ? html`<caption class="clippy-token-group-table__caption">
                ${this.path}
              </caption>`
            : nothing
        }
        <thead class="clippy-token-group-table__head">
          <tr>
            <th class="clippy-token-group-table__cell clippy-token-group-table__header-cell" scope="col">
              ${this.exampleLabel}
            </th>
            <th class="clippy-token-group-table__cell clippy-token-group-table__header-cell" scope="col">
              ${this.nameLabel}
            </th>
            <th class="clippy-token-group-table__cell clippy-token-group-table__header-cell" scope="col">
              ${this.valueLabel}
            </th>
            <th class="clippy-token-group-table__cell clippy-token-group-table__header-cell" scope="col">
              ${this.actionsLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          ${this.#renderTokenGroup(rootPath, group)}
        </tbody>
      </table>
    `;
  }
}
