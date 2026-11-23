import '@nl-design-system-community/clippy-components/clippy-token-table';
import { consume } from '@lit/context';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { stringifyTokenValue } from '@nl-design-system-community/clippy-components/lib/tokens';
import {
  BaseDesignToken,
  isRef,
  isTokenGroup,
  isTokenLike,
  stringifyToken,
  TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import dlv from 'dlv';
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import styles from './styles';

const tag = 'wizard-tokens-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokensTable;
  }
}

@safeCustomElement(tag)
export class WizardTokensTable extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ type: String })
  path = '';

  #renderTokenRow = (name: string, token: BaseDesignToken): TemplateResult => {
    // TODO: allow top-level attribute that allows user to pass preference for showing final value, common token or brand token of value
    return html`
      <tr>
        <td>
          <div class="wizard-tokens-table__token-sample">
            <clippy-token-sample .token=${token}>Aa</clippy-token-sample>
          </div>
        </td>
        <td>${name}</td>
        <td>${isRef(token.$value) ? token.$value : stringifyTokenValue(token)}</td>
        <td>
          <slot name="actions">
            <clippy-toggletip text="Kopieer">
              <clippy-button
                icon-only
                purpose="subtle"
                size="small"
                @click=${() => navigator.clipboard.writeText(stringifyToken(token))}
              >
                Kopieer ${stringifyToken(token)}
                <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
              </clippy-button>
            </clippy-toggletip>
          </slot>
        </td>
      </tr>
    `;
  };

  // TODO: Sort sub-groups and properties as per https://github.com/nl-design-system/documentatie/blob/main/docs/handboek/huisstijl-vastleggen/_design-tokens-volgorde.md
  #renderTokenGroup = (name: string[], group: TokenGroup): TemplateResult => {
    return html`
      ${map(Object.entries(group), ([property, item]) => {
        if (isTokenLike(item)) {
          return this.#renderTokenRow(property, item);
        } else if (isTokenGroup(item)) {
          const nestedProperty = name.concat(property);
          return html`
            <tr>
              <td scope="row" colspan="4">${nestedProperty.join('.')}</td>
            </tr>
            ${this.#renderTokenGroup(nestedProperty, item)}
          `;
        }
        return nothing;
      })}
    `;
  };

  override render() {
    const groupAt = dlv(this.theme.tokens, this.path) ?? {};
    return html`
      <table>
        <caption>
          ${this.path}
        </caption>
        <thead>
          <tr>
            <th scope="column">Voorbeeld</th>
            <th scope="column">Naam</th>
            <th scope="column">Alias</th>
            <th scope="column">Acties</th>
          </tr>
        </thead>
        <tbody>
          ${this.#renderTokenGroup([this.path], groupAt)}
        </tbody>
      </table>
    `;
  }
}
