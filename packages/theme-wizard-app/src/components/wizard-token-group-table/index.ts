import '@nl-design-system-community/clippy-components/clippy-token-group-table';
import { consume } from '@lit/context';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import '../wizard-table-scroller';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-token-group-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenGroupTable;
  }
}

@safeCustomElement(tag)
export class WizardTokenGroupTable extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ type: String })
  path = '';

  override render() {
    return html`
      <wizard-table-scroller>
        <clippy-token-group-table
          .theme=${this.theme.tokens}
          path=${this.path}
          example-label=${t('tokensTable.example')}
          name-label=${t('tokensTable.name')}
          value-label=${t('tokensTable.value')}
          actions-label=${t('tokensTable.actions')}
          copy-label=${t('tokensTable.copy')}
        ></clippy-token-group-table>
      </wizard-table-scroller>
    `;
  }
}
