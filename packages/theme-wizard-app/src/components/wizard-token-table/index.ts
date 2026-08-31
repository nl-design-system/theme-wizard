import '@nl-design-system-community/clippy-components/clippy-token-table';
import { consume } from '@lit/context';
import '../wizard-table-scroller';

import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import { LitElement, html, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';

const tag = 'wizard-token-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenTable;
  }
}

@safeCustomElement(tag)
export class WizardTokenTable extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ converter: arrayFromCommaList })
  groups: string[] = [];

  #visibleTokens: BaseDesignToken[] = [];

  protected override willUpdate(changedProperties: PropertyValues) {
    if (
      !changedProperties.has('theme') &&
      !changedProperties.has('groups') &&
      !changedProperties.has('skipRedundantGroups')
    ) {
      return;
    }

    /* Do something */
    const tokens = this.groups.map((group) => {
      return dlv(this.theme.tokens, group);
    });

    this.#visibleTokens = tokens;
  }

  override render() {
    return html`
      <clippy-reset-theme>
        <wizard-preview-theme>
          <clippy-token-table
            .tokens=${this.#visibleTokens}
            example-label=${t('styleGuide.sample')}
            token-id-label=${t('styleGuide.tokenName')}
            value-label=${t('styleGuide.value')}
            reference-to-label=${t('styleGuide.referenceTo')}
            details-label=${t('styleGuide.details')}
            show-details-label=${t('styleGuide.showDetails')}
            copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
            reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
            reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
          ></clippy-token-table>
        </wizard-preview-theme>
      </clippy-reset-theme>
    `;
  }
}
