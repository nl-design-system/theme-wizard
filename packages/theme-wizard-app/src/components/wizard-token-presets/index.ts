import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { dequal } from 'dequal';
import { LitElement, PropertyValues, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Theme from '../../lib/Theme';
import { resolveTokenReferenceValue } from '../../lib/token-value';
import { ThemeUpdateEvent } from '../app/app';
import { wizardTokenCSS } from './styles';

const tag = 'wizard-token-preset';
const themeTag = 'start-theme';

type PresetOption = {
  description?: string;
  name: string;
  previewStyle?: string;
  tokens: unknown;
};

type FlattenedTokenValue = {
  path: string;
  value: string;
};

@customElement(tag)
export class WizardTokenPreset extends LitElement {
  @property({
    converter: {
      fromAttribute: (value) => JSON.parse(value || '[]'),
    },
    type: Object,
  })
  options: PresetOption[] = [];

  @property({ attribute: 'group-label', type: String })
  groupLabel = '';

  private readonly inputName = `${tag}-${Math.random().toString(36).slice(2)}`;
  private readonly handleThemeUpdate = (event: ThemeUpdateEvent) => this.onThemeUpdate(event);
  private currentTheme = new Theme();
  private defaultIndexState = -1;
  private selectedIndexState = -1;

  override connectedCallback(): void {
    super.connectedCallback();
    this.ownerDocument.addEventListener('theme-update', this.handleThemeUpdate);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ownerDocument.removeEventListener('theme-update', this.handleThemeUpdate);
  }

  override updated(changed: PropertyValues) {
    if (changed.has('options')) {
      this.defaultIndexState = -1;
      this.updateSelectedIndex(this.currentTheme);
    }
  }

  get selectedIndex() {
    return this.selectedIndexState;
  }

  get defaultIndex() {
    return this.defaultIndexState;
  }

  get selectedOption() {
    const option = this.options[this.selectedIndex];

    if (!option) {
      return null;
    }

    return {
      optionLabel: option.name,
      previewStyle: option.previewStyle ?? '',
      tokens: option.tokens,
    };
  }

  get optionLabel() {
    return this.selectedOption?.optionLabel ?? '';
  }

  get previewStyle() {
    return this.selectedOption?.previewStyle ?? '';
  }

  get value() {
    return this.selectedOption?.tokens ?? {};
  }

  public clearSelection() {
    this.setSelectedIndex(-1);
  }

  public selectIndex(index: number) {
    if (index < 0 || index >= this.options.length) return;

    this.setSelectedIndex(index);
    this.dispatchSelectionChange();
  }

  private walkPresetTokens(tokens: unknown, path: string[], callback: (value: unknown, path: string[]) => void) {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) return;

    const obj = tokens as Record<string, unknown>;

    if (Object.hasOwn(obj, '$value')) {
      callback(obj['$value'], path);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      this.walkPresetTokens(value, [...path, key], callback);
    }
  }

  private flattenTokenValues(tokens: unknown, path: string[] = []): FlattenedTokenValue[] {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) return [];

    const obj = tokens as Record<string, unknown>;

    if (Object.hasOwn(obj, '$value')) {
      const rawValue = obj['$value'];

      return [
        {
          path: path.join('.'),
          value:
            typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue) : JSON.stringify(rawValue),
        },
      ];
    }

    return Object.entries(obj).flatMap(([key, value]) => this.flattenTokenValues(value, [...path, key]));
  }

  private formatTokenPathLabel(path: string) {
    return path
      .split('.')
      .slice(-2)
      .join(' ')
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private splitTokenValue(value: string) {
    const normalized = value.startsWith('{') && value.endsWith('}') ? value.slice(1, -1) : value;
    const lastDotIndex = normalized.lastIndexOf('.');

    if (lastDotIndex === -1) {
      return { base: '', last: normalized };
    }

    return {
      base: `${normalized.slice(0, lastDotIndex + 1)}`,
      last: normalized.slice(lastDotIndex + 1),
    };
  }

  private getCommonPrefixSegmentCount(values: string[][]) {
    if (values.length === 0) return 0;

    let prefixCount = 0;
    const shortestLength = Math.min(...values.map((value) => value.length));

    while (prefixCount < shortestLength) {
      const segment = values[0][prefixCount];
      let matches = true;

      for (const value of values) {
        if (value[prefixCount] !== segment) {
          matches = false;
          break;
        }
      }

      if (!matches) {
        break;
      }

      prefixCount += 1;
    }

    return prefixCount;
  }

  private getCommonSuffixSegmentCount(values: string[][], prefixCount: number) {
    if (values.length === 0) return 0;

    let suffixCount = 0;
    const shortestLength = Math.min(...values.map((value) => value.length - prefixCount));

    while (suffixCount < shortestLength) {
      const indexFromEnd = suffixCount + 1;
      const segment = values[0][values[0].length - indexFromEnd];
      let matches = true;

      for (const value of values) {
        if (value[value.length - indexFromEnd] !== segment) {
          matches = false;
          break;
        }
      }

      if (!matches) {
        break;
      }

      suffixCount += 1;
    }

    return suffixCount;
  }

  private splitTokenValueByVariants(value: string, variants: string[]) {
    const normalizedValue = value.startsWith('{') && value.endsWith('}') ? value.slice(1, -1) : value;
    const normalizedVariants = variants.map((variant) =>
      variant.startsWith('{') && variant.endsWith('}') ? variant.slice(1, -1) : variant,
    );
    const uniqueVariants = Array.from(new Set(normalizedVariants));

    if (uniqueVariants.length <= 1) {
      return this.splitTokenValue(value);
    }

    const variantSegments = uniqueVariants.map((variant) => variant.split('.'));
    const valueSegments = normalizedValue.split('.');
    const prefixCount = this.getCommonPrefixSegmentCount(variantSegments);
    const suffixCount = this.getCommonSuffixSegmentCount(variantSegments, prefixCount);
    const middleSegments = valueSegments.slice(prefixCount, valueSegments.length - suffixCount || undefined);
    const middle = middleSegments.join('.');

    if (!middle) {
      return this.splitTokenValue(value);
    }

    return {
      base: prefixCount > 0 ? `${valueSegments.slice(0, prefixCount).join('.')}.` : '',
      last: middle,
      suffix: suffixCount > 0 ? `.${valueSegments.slice(valueSegments.length - suffixCount).join('.')}` : '',
    };
  }

  private collectTokenValueVariants(option: PresetOption) {
    const tokenValues = this.flattenTokenValues(option.tokens);
    const tokenPaths = Array.from(new Set(tokenValues.map((token) => token.path)));

    return Object.fromEntries(
      tokenPaths.map((tokenPath) => [
        tokenPath,
        tokenValues.filter((token) => token.path === tokenPath).map((token) => token.value),
      ]),
    );
  }

  private matchesTheme(theme: Theme, tokens: unknown) {
    let selected = true;

    this.walkPresetTokens(tokens, [], (presetValue, path) => {
      if (!selected) return;

      const themeToken = theme.at(path.join('.'));
      const themeValue = themeToken ? themeToken['$value'] : null;

      if (!dequal(themeValue, presetValue)) {
        selected = false;
      }
    });

    return selected;
  }

  private setSelectedIndex(index: number) {
    this.selectedIndexState = index;
    this.toggleAttribute('selected', index >= 0);
    this.requestUpdate();
  }

  private updateSelectedIndex(theme: Theme) {
    const selectedIndex = this.options.findIndex((option) => this.matchesTheme(theme, option.tokens));

    if (this.defaultIndexState === -1 && selectedIndex >= 0) {
      this.defaultIndexState = selectedIndex;
    }

    this.setSelectedIndex(selectedIndex);
  }

  private onThemeUpdate(event: CustomEvent) {
    if (event.detail.theme) {
      this.currentTheme = event.detail.theme;
      this.updateSelectedIndex(event.detail.theme);
    }
  }

  private dispatchSelectionChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private onOptionChange(index: number) {
    this.setSelectedIndex(index);
    this.dispatchSelectionChange();
  }

  private renderTokenValue(option: PresetOption, token: FlattenedTokenValue) {
    const tokenValueParts = this.splitTokenValueByVariants(
      token.value,
      this.collectTokenValueVariants(option)[token.path] ?? [token.value],
    );
    const resolvedValue = resolveTokenReferenceValue(token.value, this.currentTheme);

    return html`
      <p class="nl-paragraph wizard-token-preset__option-value">
        <span class="wizard-token-preset__option-value-heading">
          <span class="wizard-token-preset__option-value-label">${this.formatTokenPathLabel(token.path)}</span>

          <code class="wizard-token-preset__option-value-path">${token.path}</code>
        </span>

        <span class="wizard-token-preset__option-value-mapping">
          <span class="wizard-token-preset__option-value-mapping-label" aria-hidden="true">↓</span>

          <code class="wizard-token-preset__option-value-token"
            >${tokenValueParts.base}<strong class="wizard-token-preset__option-value-token-strong"
              >${tokenValueParts.last}</strong
            >${'suffix' in tokenValueParts ? tokenValueParts.suffix : ''}</code
          >
        </span>

        ${resolvedValue && resolvedValue !== token.value
          ? html`
              <span class="wizard-token-preset__option-value-mapping">
                <span class="wizard-token-preset__option-value-mapping-label" aria-hidden="true">↓</span>

                <code class="wizard-token-preset__option-value-resolved">${resolvedValue}</code>
              </span>
            `
          : nothing}
      </p>
    `;
  }

  private renderTokenDetails(option: PresetOption) {
    const tokenValues = this.flattenTokenValues(option.tokens);

    if (tokenValues.length === 0) {
      return nothing;
    }

    if (tokenValues.length === 1) {
      return html`<div class="wizard-token-preset__option-values">
        ${this.renderTokenValue(option, tokenValues[0])}
      </div>`;
    }

    return html`
      <details class="wizard-token-preset__option-values wizard-token-preset__option-values--summary">
        <summary class="wizard-token-preset__option-values-summary">Tokens (${tokenValues.length})</summary>

        <div class="wizard-token-preset__option-values-list">
          ${tokenValues.map((token) => this.renderTokenValue(option, token))}
        </div>
      </details>
    `;
  }

  static override readonly styles = [unsafeCSS(buttonCss), wizardTokenCSS];

  override render() {
    return html`
      <fieldset class="wizard-token-preset__group">
        <legend class="wizard-token-preset__legend">${this.groupLabel || 'Preset opties'}</legend>
        ${this.options.map((option, index) => {
          const isSelected = index === this.selectedIndex;
          const isDefault = index === this.defaultIndexState;

          return html`
            <div class="wizard-token-preset__option">
              <label class="wizard-token-preset__label">
                <input
                  class="wizard-token-preset__control"
                  type="radio"
                  name=${this.inputName}
                  .value=${String(index)}
                  ?checked=${isSelected}
                  @change=${() => this.onOptionChange(index)}
                />
                <span
                  class="nl-button nl-button--secondary wizard-token-preset__button ${isSelected
                    ? 'nl-button--pressed'
                    : ''}"
                >
                  <span class="wizard-token-preset__option-title-row">
                    <span class="nl-paragraph wizard-token-preset__option-title">${option.name}</span>
                    ${isDefault
                      ? html`<span class="wizard-token-preset__option-default-pill">${themeTag}</span>`
                      : nothing}
                  </span>

                  ${option.description
                    ? html`<span class="nl-paragraph wizard-token-preset__option-description"
                        >${unsafeHTML(option.description)}</span
                      >`
                    : nothing}
                </span>
              </label>
              ${isSelected ? this.renderTokenDetails(option) : nothing}
            </div>
          `;
        })}
      </fieldset>
    `;
  }
}
