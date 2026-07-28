import type { ColorGroup } from '@nl-design-system-community/clippy-components/clippy-token-color-table';
import '@nl-design-system-community/clippy-components/clippy-token-color-table';
import { consume } from '@lit/context';
import '../wizard-table-scroller';

import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { stringifyColor } from '@nl-design-system-community/design-tokens-schema';
import { type ColorToken as ColorTokenType } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { resolveColorValue } from '../wizard-colorscale-input';
import { countUsagePerToken } from '../wizard-style-guide/utils';

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

  #prepareColorGroups(colors: Record<string, unknown>, tokenUsage: Map<string, string[]>): ColorGroup[] {
    return Object.entries(colors)
      .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([key, value]) => {
        const colorEntries = Object.entries(value as Record<string, unknown>)
          .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
          .map(([colorKey, token]) => {
            const color = resolveColorValue(token as ColorTokenType);
            const displayValue = color ? stringifyColor(color) : '#000';
            const tokenId = `basis.color.${key}.${colorKey}`;
            const usage = tokenUsage.get(tokenId) || [];
            const usageCount = usage.length;
            return { colorKey, displayValue, tokenId, usage, usageCount };
          })
          .filter(({ displayValue }) => displayValue !== null);
        return { colorEntries, key };
      });
  }

  override connectedCallback() {
    super.connectedCallback();

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);

    const colorTokenGroups = this.#prepareColorGroups(colors, tokenUsage);
    this.#visibleTokenGroups = this.#filterColorGroups(this.groups, colorTokenGroups);
  }

  #filterColorGroups(groups: string[], colorTokenGroups: ColorGroup[]) {
    if (groups.length === 0) return colorTokenGroups;

    const foundGroups = groups.map((groupKey) => colorTokenGroups.find((group) => group.key === groupKey));
    return foundGroups.filter((group): group is NonNullable<typeof group> => group !== undefined);
  }

  override render() {
    return html`<clippy-token-color-table .groups=${this.#visibleTokenGroups}></clippy-token-color-table>`;
  }
}
