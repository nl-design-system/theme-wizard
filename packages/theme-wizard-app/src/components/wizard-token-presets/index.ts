import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { dequal } from 'dequal';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
import Theme from '../../lib/Theme';
import { ThemeUpdateEvent } from '../app/app';
import { wizardTokenCSS } from './styles';

const tag = 'wizard-token-preset';

@customElement(tag)
export class WizardTokenPreset extends LitElement {
  @property({
    converter: {
      fromAttribute: (value) => JSON.parse(value || '{}'),
    },
    type: Object,
  })
  value = {};

  @property({ type: String })
  name = '';

  @property({ type: String })
  description = '';

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  _bindHandleThemeUpdate = (event: ThemeUpdateEvent) => this._handleThemeUpdate(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.ownerDocument.addEventListener('theme-update', this._bindHandleThemeUpdate);

    if (this.theme) {
      this._updateSelected(this.theme);
    } else {
      console.log('Cannot determine initial selected state without Theme');
    }
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ownerDocument.removeEventListener('theme-update', this._bindHandleThemeUpdate);
  }

  private _selected = false;

  get selected() {
    return this._selected;
  }

  _handleThemeUpdate(_evt: CustomEvent) {
    if (_evt.detail.theme) {
      const theme = _evt.detail.theme;
      this._updateSelected(theme);
    }
  }

  private _walkPresetTokens(tokens: unknown, path: string[], callback: (value: unknown, path: string[]) => void) {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) return;
    const obj = tokens as Record<string, unknown>;
    if (Object.hasOwn(obj, '$value')) {
      callback(obj['$value'], path);
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      this._walkPresetTokens(value, [...path, key], callback);
    }
  }

  private _updateSelected(theme: Theme) {
    // Start with `true`. An empty preset is always selected 🤷‍♂️
    let selected = true;

    this._walkPresetTokens(this.value, [], (presetValue, path) => {
      if (!selected) return;
      const themeToken = theme.at(path.join('.'));
      const themeValue = themeToken ? themeToken['$value'] : null;
      if (!dequal(themeValue, presetValue)) {
        selected = false;
      }
    });

    // TODO: We could calculate this `selected` state lazily, and invalidate the cached
    // value at the `theme-update` event.
    this._selected = selected;
    this.toggleAttribute('selected', selected);
    this.requestUpdate();
  }
  private readonly onButtonClick = () => {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  static override readonly styles = [unsafeCSS(buttonCss), wizardTokenCSS];

  override render() {
    return html`
      <button
        class="nl-button nl-button--secondary ${this.selected ? ' nl-button--pressed' : ''}"
        aria-pressed="${this.selected ? 'true' : 'false'}"
        type="button"
        @click=${this.onButtonClick}
      >
        <span class="nl-paragraph wizard-token-preset__option-title">${this.name}</span>
        ${this.description
          ? html`<span class="nl-paragraph wizard-token-preset__option-description">${this.description}</span>`
          : nothing}
      </button>
    `;
  }
}
