import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { ClippyTokenCombobox, type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { generateScale, TOKENS } from '@nl-design-system-community/color-scale-generator';
import {
  type ColorToken,
  EXTENSION_COLORSCALE_SEED,
  getExtension,
  stringifyToken,
  type BaseDesignToken,
  ColorValueSchema,
} from '@nl-design-system-community/design-tokens-schema';
import { capitalize } from 'es-toolkit';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { describeColor } from '../../lib/ColorDescription';
import { INVERSE_SUFFIX, type ProfileName } from '../../lib/ColorScale';
import { getRelevantTokens } from '../../lib/relevant-tokens';
import { sortTokensForPath } from '../../lib/token-sort-strategies';
import { StagedDesignToken } from '../../utils';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
import { hasChangedProperty } from '../../utils/lit';
import styles from './styles';

const tag = 'wizard-form-colorscale';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFormColorscale;
  }
}

@safeCustomElement(tag)
export class WizardFormColorscale extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), styles];

  @state() private options: Option[] = [];
  @state() private selectedColorToken: ColorToken | undefined = undefined;

  @query('form')
  private form!: HTMLFormElement;

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  private readonly scrapedTokens!: StagedDesignToken[];

  @property({ type: String })
  path: string = '';

  @property({ type: String })
  profile: ProfileName = 'neutral';

  @property() label: string = '';

  private _tokens: BaseDesignToken[] = [];

  get tokenAt() {
    return this.theme.at(this.path) as BaseDesignToken | undefined;
  }

  get type() {
    return 'color';
  }

  get tokens() {
    return this._tokens;
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement) || !this.selectedColorToken) {
      return;
    }

    const seedToken = this.selectedColorToken;
    const stringifiedSeed = stringifyToken(seedToken);
    const regular = generateScale(stringifiedSeed, {
      anchor: 'auto',
      contrast: { enforce: true },
      profile: this.profile as ProfileName,
    }).data;

    const inversedPath = `${this.path}-inverse`;
    const inversed = generateScale(stringifiedSeed, {
      anchor: 'auto',
      contrast: { enforce: true },
      inverse: true,
      profile: this.profile as ProfileName,
    }).data;

    const detail = {
      groupSeeds: [
        {
          groupPath: this.path,
          seed: seedToken.$value,
        },
        {
          groupPath: inversedPath,
          seed: seedToken.$value,
        },
      ],
      tokens: TOKENS.flatMap((tokenName) => [
        { path: `${this.path}.${tokenName}`, value: regular[tokenName] },
        { path: `${inversedPath}.${tokenName}`, value: inversed[tokenName] },
      ]),
    };

    // Emit custom event that lets Theme do updateMany()
    event.target.dispatchEvent(
      new CustomEvent<UpdateDesignTokensDetail>(UPDATE_DESIGN_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  #tokensToOptions = () => {
    this.options = this._tokens.map((token) => {
      const color = stringifyToken(token);

      return {
        description: capitalize(describeColor(color, (key) => t(key) as string)),
        label: color,
        value: token,
      };
    });
  };

  get #seedColorToken(): ColorToken | undefined {
    const isInverse = this.path.endsWith(INVERSE_SUFFIX);
    const seedColor = getExtension(this.tokenAt, EXTENSION_COLORSCALE_SEED);
    const parsedSeed = ColorValueSchema.safeParse(seedColor);
    if (parsedSeed.success) {
      return {
        $type: 'color',
        $value: parsedSeed.data,
      };
    } else {
      const fallBackToken = isInverse
        ? (this.tokenAt?.['bg-default'] as ColorToken)
        : (this.tokenAt?.['color-default'] as ColorToken);
      return fallBackToken;
    }
  }

  // #createTokenValue (color: ColorValue)

  protected override willUpdate(changed: PropertyValues) {
    if (!hasChangedProperty(changed, ['scrapedTokens', 'path', 'theme'])) {
      return;
    }

    const { tokens } = getRelevantTokens(this.theme, this.scrapedTokens, this.type);
    this._tokens = sortTokensForPath(tokens, this.path, this.theme);
    this.#tokensToOptions();
  }

  protected override firstUpdated() {
    // Get initial seed color
    const seedColorToken = this.#seedColorToken;
    if (seedColorToken) {
      this.selectedColorToken = seedColorToken;
    }
  }

  #handleColorChange = (event: Event) => {
    const target = event.target;
    if (target instanceof ClippyTokenCombobox && target.value) {
      const rawSelectedToken = target.value as ColorToken;

      if (rawSelectedToken === this.selectedColorToken) return;

      this.selectedColorToken = rawSelectedToken;
      if (!this.isConnected) return;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      if (this.form) {
        this.form.requestSubmit();
      }
    }
  };

  override render() {
    const { label, tokenAt } = this;
    const optionCount = this.options.length;

    if (!tokenAt) {
      return html`<p class="nl-paragraph">${t('wizard.stepForm.errorNoToken', { path: this.path })}</p>`;
    }

    if (optionCount === 0) {
      return html`<p class="nl-paragraph">${t('wizard.stepForm.noRecommendations')}</p>`;
    }

    const renderedLabel = label || this.path;

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <clippy-token-combobox
          name=${this.path}
          type="color"
          .value=${this.selectedColorToken}
          .options=${this.options}
          @change=${this.#handleColorChange}
        >
          <span slot="label">${renderedLabel}</span>
        </clippy-token-combobox>
      </form>
    `;
  }
}
