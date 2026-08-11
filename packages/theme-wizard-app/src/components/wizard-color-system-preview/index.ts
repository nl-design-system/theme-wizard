import type { ColorGroup } from '@nl-design-system-community/clippy-components/clippy-token-table-color';
import '@nl-design-system-community/clippy-components/clippy-token-table-color';
import { consume } from '@lit/context';
import '../wizard-table-scroller';

import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { LitElement, html, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { getSiblingGroupsWithOnlyRefsTo } from '../../lib/ColorScale/siblings';
import { countUsagePerToken, prepareColorGroups } from '../wizard-style-guide/utils';

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

  #visibleTokenGroups: ColorGroup[] = [];

  @property({ converter: arrayFromCommaList })
  groups: string[] = [];

  /** Group key prefixes (e.g. "accent") to drop when a group's colors are only references to an earlier group in `groups`, e.g. accent-2 entirely re-pointing at accent-1. */
  @property({ attribute: 'skip-redundant-groups', converter: arrayFromCommaList })
  skipRedundantGroups: string[] = [];

  protected override willUpdate(changedProperties: PropertyValues) {
    if (
      !changedProperties.has('theme') &&
      !changedProperties.has('groups') &&
      !changedProperties.has('skipRedundantGroups')
    ) {
      return;
    }

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);

    const colorTokenGroups = prepareColorGroups(colors, tokenUsage);
    const requestedGroups = this.groups.length > 0 ? this.groups : colorTokenGroups.map((group) => group.key);
    const visibleGroups =
      this.skipRedundantGroups.length > 0
        ? this.#dropRedundantGroups(requestedGroups, colors, this.skipRedundantGroups)
        : requestedGroups;

    this.#visibleTokenGroups = this.#filterColorGroups(visibleGroups, colorTokenGroups);
  }

  #filterColorGroups(groups: string[], colorTokenGroups: ColorGroup[]) {
    if (groups.length === 0) return colorTokenGroups;

    const foundGroups = groups.map((groupKey) => colorTokenGroups.find((group) => group.key === groupKey));
    return foundGroups.filter((group): group is NonNullable<typeof group> => group !== undefined);
  }

  /** Drops each group matching `prefixes` that is entirely composed of references into an earlier group, e.g. accent-3 re-pointing at accent-1 or accent-2. */
  #dropRedundantGroups(groupKeys: string[], colors: Record<string, unknown>, prefixes: string[]) {
    const seenGroupKeys: string[] = [];

    return groupKeys.filter((groupKey) => {
      const isRedundant =
        prefixes.some((prefix) => groupKey.startsWith(prefix)) &&
        seenGroupKeys.some((seenGroupKey) =>
          getSiblingGroupsWithOnlyRefsTo(`basis.color.${seenGroupKey}`, colors).includes(`basis.color.${groupKey}`),
        );

      seenGroupKeys.push(groupKey);
      return !isRedundant;
    });
  }

  override render() {
    return html`<clippy-token-table-color
      .groups=${this.#visibleTokenGroups}
      example-label="${t('styleGuide.sample')}"
      value-label="${t('styleGuide.value')}"
      reference-title-label="${t('styleGuide.detailsDialog.tokenReferenceList.title')}"
      reference-empty-label="${t('styleGuide.detailsDialog.tokenReferenceList.empty')}"
      background-label="${t('styleGuide.colorSystem.background')}"
      border-label="${t('styleGuide.colorSystem.border')}"
      foreground-label="${t('styleGuide.colorSystem.foreground')}"
    ></clippy-token-table-color>`;
  }
}
