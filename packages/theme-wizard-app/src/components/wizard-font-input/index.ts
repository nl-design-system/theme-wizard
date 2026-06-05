import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-font-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { ClippyTokenCombobox, type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import {
  EXTENSION_RESOLVED_AS,
  isRef,
  ModernFontFamilyToken,
  resolveRef,
  setExtension,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils';
import { WizardTokenInput } from '../wizard-token-input';

export type FontOption = { label: string; value: ModernFontFamilyToken['$value'] };

export const DEFAULT_FONT_OPTIONS: Option[] = [
  {
    label: 'System UI',
    value: {
      $type: 'fontFamily',
      $value: ['system-ui', 'sans-serif'],
    },
  },
  {
    label: 'Arial',
    value: {
      $type: 'fontFamily',
      $value: ['Arial', 'sans-serif'],
    },
  },
  {
    label: 'Georgia',
    value: {
      $type: 'fontFamily',
      $value: ['Georgia', 'serif'],
    },
  },
  {
    label: 'Times New Roman',
    value: {
      $type: 'fontFamily',
      $value: ['Times New Roman', 'serif'],
    },
  },
  {
    label: 'Courier New',
    value: {
      $type: 'fontFamily',
      $value: ['Courier New', 'monospace'],
    },
  },
  {
    label: 'Verdana',
    value: {
      $type: 'fontFamily',
      $value: ['Verdana', 'sans-serif'],
    },
  },
];

const tag = 'wizard-font-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFontInput;
  }
}

@customElement(tag)
export class WizardFontInput extends WizardTokenInput {
  @property() defaultOptionsLabel = 'Standaardopties';
  @property() optionsLabel = 'Opties';
  @property({ type: Array }) options: Option[] = [];

  readonly #token: ModernFontFamilyToken = {
    $type: 'fontFamily',
    $value: [],
  };

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  scrapedTokens: StagedDesignToken[] = [];

  @consume({ context: themeContext, subscribe: true })
  @property({ attribute: false })
  private readonly theme!: Theme;

  override get value() {
    return this.#token.$value;
  }

  override set value(value: ModernFontFamilyToken['$value']) {
    const oldValue = this.#token.$value;
    this.#token.$value = value;
    this.internals_.setFormValue(WizardFontInput.valueAsString(value));
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof ClippyTokenCombobox)) return;
    this.value = target?.value?.$value ?? '';
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override render() {
    const themeTokens: ModernFontFamilyToken[] = [];
    walkTokens(this.theme.tokens['basis'], (token) => {
      if (token.$type === 'fontFamily' && !isRef(token.$value)) {
        themeTokens.push(token as ModernFontFamilyToken);
      }
    });

    const options: Option[] = [
      ...this.scrapedTokens.reduce<Option[]>((acc, token) => {
        if (token.$extensions?.[EXTENSION_TOKEN_STAGED] === true && token.$type === 'fontFamily') {
          acc.push({
            label: token.$value[0],
            value: token,
          });
        }
        return acc;
      }, []),
      ...themeTokens.map((token) => ({
        label: token.$value[0],
        value: token,
      })),
      ...DEFAULT_FONT_OPTIONS,
    ];

    const resolvedValueToken: ModernFontFamilyToken = { $type: 'fontFamily', $value: this.value };
    const resolvedRef = this.value;
    if (isRef(resolvedRef)) {
      const resolvedToken = resolveRef(this.theme.tokens, resolvedRef) as ModernFontFamilyToken;

      if (resolvedToken) {
        setExtension(resolvedValueToken, EXTENSION_RESOLVED_AS, resolvedToken.$value);
      }
    }

    return html`
      <div class="utrecht-form-field__input">
        ${this.errors.map(
          (error) =>
            html`<div class="utrecht-form-field-error-message" id=${error.id}>
              ${t(`validation.error.${error.code}.compact`, error)}
            </div>`,
        )}
        <clippy-token-combobox
          type="fontFamily"
          hidden-label="${this.label}"
          name=${this.name}
          @change=${this.#handleChange}
          .value=${resolvedValueToken}
          .options=${options}
          aria-invalid=${this.hasErrors ? 'true' : nothing}
          aria-errormessage=${this.hasErrors ? this.errors.map((error) => error.id).join(' ') : nothing}
        ></clippy-token-combobox>
      </div>
    `;
  }
}
