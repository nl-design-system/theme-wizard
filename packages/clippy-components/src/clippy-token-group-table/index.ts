import '../clippy-button';
import '../clippy-icon';
import '../clippy-toggletip';
import '../clippy-token-sample';
import {
  type BaseDesignToken,
  isRef,
  isTokenGroup,
  isTokenLike,
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

  readonly #renderTokenRow = (name: string, token: BaseDesignToken): TemplateResult => {
    const tokenString = stringifyTokenValue(token);
    return html`
      <tr class="clippy-token-group-table__row">
        <td class="clippy-token-group-table__cell">
          <div class="clippy-token-group-table__token-sample">
            <clippy-token-sample .token=${token}>Aa</clippy-token-sample>
          </div>
        </td>
        <td class="clippy-token-group-table__cell">${name}</td>
        <td class="clippy-token-group-table__cell">${isRef(token.$value) ? token.$value : tokenString}</td>
        <td class="clippy-token-group-table__cell">
          <clippy-toggletip text=${`${this.copyLabel} "${tokenString}"`}>
            <clippy-button
              icon-only
              purpose="subtle"
              size="small"
              @click=${() => navigator.clipboard.writeText(tokenString)}
            >
              ${this.copyLabel} ${tokenString}
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
    if (this.theme === null || this.theme === undefined) {
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
