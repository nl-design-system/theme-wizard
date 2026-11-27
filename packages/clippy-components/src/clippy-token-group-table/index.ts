import '../clippy-button';
import '../clippy-icon';
import '../clippy-toggletip';
import '../clippy-token-sample';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type BaseDesignToken,
  extractRef,
  isRef,
  isTokenGroup,
  isTokenLike,
  stringifyToken,
  type TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import dlv from 'dlv';
import { LitElement, type TemplateResult, html, nothing, unsafeCSS } from 'lit';
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
  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(codeCss), styles];

  /** Renders nothing while `null` or `undefined` */
  @property({ type: Object }) theme?: TokenGroup | null;
  @property({ type: String }) path = '';

  /** Table caption; defaults to `this.path` */
  @property({ type: String }) caption = '';
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

  readonly #renderTokenRow = (path: string[], name: string, token: BaseDesignToken): TemplateResult => {
    const tokenString = stringifyToken(token);
    const tokenPath = path.concat(name).join('.');
    return html`
      <tr class="clippy-token-group-table__row">
        <td class="clippy-token-group-table__cell">
          <div class="clippy-token-group-table__token-sample" aria-hidden="true">
            <clippy-token-sample .token=${token}>Aa</clippy-token-sample>
          </div>
        </td>
        <th class="clippy-token-group-table__cell clippy-token-group-table__name-cell" scope="row">${name}</th>
        <td class="clippy-token-group-table__cell">
          ${
            isRef(token.$value)
              ? html`<span class="nl-data-badge">${extractRef(token.$value)}</span>`
              : html`<code class="nl-code">${tokenString}</code>`
          }
        </td>
        <td class="clippy-token-group-table__cell">
          <clippy-toggletip text=${`${this.copyLabel} "${tokenString}"`}>
            <clippy-button
              icon-only
              purpose="subtle"
              size="small"
              @click=${() => navigator.clipboard.writeText(tokenString)}
            >
              ${this.copyLabel} ${tokenPath}
              <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
            </clippy-button>
          </clippy-toggletip>
        </td>
      </tr>
    `;
  };

  // TODO: Sort sub-groups and properties as per https://github.com/nl-design-system/documentatie/blob/main/docs/handboek/huisstijl-vastleggen/_design-tokens-volgorde.md
  // Tables can't nest tbody, so every (nested) group becomes a sibling tbody: own tokens first, then sub-groups
  readonly #renderTokenGroup = (path: string[], group: TokenGroup, isRoot = false): TemplateResult => {
    const entries = Object.entries(group);
    const tokens = entries.filter((entry): entry is [string, BaseDesignToken] => isTokenLike(entry[1]));
    const groups = entries.filter(
      (entry): entry is [string, TokenGroup] => !isTokenLike(entry[1]) && isTokenGroup(entry[1]),
    );
    const hasHeader = !isRoot;
    return html`
      ${
        hasHeader || tokens.length > 0
          ? html`<tbody class="clippy-token-group-table__group">
              ${
                hasHeader
                  ? html`<tr class="clippy-token-group-table__group-row">
                      <th
                        class="clippy-token-group-table__cell clippy-token-group-table__group-cell"
                        colspan="4"
                        scope="rowgroup"
                      >
                        ${path.join('.')}
                      </th>
                    </tr>`
                  : nothing
              }
              ${map(tokens, ([name, token]) => this.#renderTokenRow(path, name, token))}
            </tbody>`
          : nothing
      }
      ${map(groups, ([name, item]) => this.#renderTokenGroup(path.concat(name), item))}
    `;
  };

  override render() {
    if (this.theme === null || this.theme === undefined) {
      return nothing;
    }
    const group = this.#getGroupAtPath(this.theme);
    const rootPath = this.path ? [this.path] : [];
    const caption = this.caption || this.path;
    return html`
      <table class="clippy-token-group-table__table">
        ${
          caption
            ? html`<caption class="clippy-token-group-table__caption">
                ${caption}
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
        ${this.#renderTokenGroup(rootPath, group, true)}
      </table>
    `;
  }
}
