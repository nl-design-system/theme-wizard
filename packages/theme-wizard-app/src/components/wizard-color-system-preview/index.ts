import type { ColorGroup } from '@nl-design-system-community/clippy-components/clippy-token-color-table';
import '@nl-design-system-community/clippy-components/clippy-token-color-table';
import '../wizard-table-scroller';

import { consume } from '@lit/context';
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

  #colorGroups: ColorGroup[] = [];
  #displayedGroups: ColorGroup[] = [];

  @property()
  groups: string = '';

  #groups: string[] = [];

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
    // store groups string in an array
    if (this.hasAttribute('groups')) {
      this.#groups = this.getAttribute('groups')!
        .split(',')
        .map((group) => group.trim());
    }

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);

    this.#colorGroups = this.#prepareColorGroups(colors, tokenUsage);
    this.#displayedGroups = this.#filterColorGroups(this.#groups);
  }

  #filterColorGroups(groups: string[]) {
    if (groups.length === 0) return this.#colorGroups;

    const foundGroups = groups.map((groupKey) => this.#colorGroups.find((group) => group.key === groupKey));
    return foundGroups.filter((group): group is NonNullable<typeof group> => group !== undefined);
  }

  override render() {
    return html`<clippy-token-color-table .groups=${this.#displayedGroups}></clippy-token-color-table>`;
  }
}
