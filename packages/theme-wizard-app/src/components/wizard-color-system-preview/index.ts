import '@nl-design-system-community/clippy-components/clippy-token-table-color';
import { consume } from '@lit/context';
import '../wizard-table-scroller';

import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { TokenCollection } from '@nl-design-system-community/clippy-components/src/clippy-token-table-color/types.js';
import { type TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { filterRedundantGroups } from '../../lib/ColorScale/siblings';
import { hasChangedProperty } from '../../utils/lit';
import { getTokenCollectionByTokenPaths } from '../wizard-style-guide/utils';

const tag = 'wizard-color-system-preview';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardColorSystemPreview;
  }
}

@safeCustomElement(tag)
export class WizardColorSystemPreview extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ converter: arrayFromCommaList })
  groups: string[] = [];

  /** Group key prefixes (e.g. "accent") to drop when a group's colors are only references to an earlier group in `groups`, e.g. accent-2 entirely re-pointing at accent-1. */
  @property({ attribute: 'skip-redundant-groups', converter: arrayFromCommaList })
  skipRedundantGroups: string[] = [];

  #visibleTokenCollection: TokenCollection = [];

  protected override willUpdate(changedProperties: PropertyValues) {
    if (!hasChangedProperty(changedProperties, ['theme', 'groups', 'skipRedundantGroups'])) {
      return;
    }
    const groupPaths: TokenPath[] = this.groups.map((str) => str.split('.'));
    const colorCollection = getTokenCollectionByTokenPaths(this.theme.tokens, groupPaths);
    const basisTokens = this.theme.tokens['basis'] as Record<string, unknown>;
    const colorTokens = basisTokens['color'] as Record<string, unknown>;

    const requestedGroups = this.groups.length > 0 ? this.groups : colorCollection.map((group) => group.name);
    const visibleGroups =
      this.skipRedundantGroups.length > 0
        ? filterRedundantGroups(requestedGroups, colorTokens, this.skipRedundantGroups, '')
        : requestedGroups;

    this.#visibleTokenCollection = this.#filterColorCollection(visibleGroups, colorCollection);
  }

  #filterColorCollection(groups: string[], tokenCollection: TokenCollection) {
    if (groups.length === 0) return tokenCollection;

    const foundGroups = groups.map((groupKey) => tokenCollection.find((group) => group.name === groupKey));
    return foundGroups.filter((group): group is NonNullable<typeof group> => group !== undefined);
  }

  override render() {
    return html`<clippy-token-table-color
      .collection=${this.#visibleTokenCollection}
      example-label="${t('styleGuide.sample')}"
      value-label="${t('styleGuide.value')}"
      reference-title-label="${t('styleGuide.detailsDialog.tokenReferenceList.title')}"
      reference-empty-label="${t('styleGuide.detailsDialog.tokenReferenceList.empty')}"
      copy-to-clipboard-label="${t('styleGuide.detailsDialog.copyToClipboard')}"
      background-label="${t('styleGuide.colorSystem.background')}"
      border-label="${t('styleGuide.colorSystem.border')}"
      foreground-label="${t('styleGuide.colorSystem.foreground')}"
    ></clippy-token-table-color>`;
  }
}
