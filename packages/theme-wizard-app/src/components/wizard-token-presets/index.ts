import { consume } from '@lit/context';
import { walkTokens } from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';
import { LitElement, html } from 'lit';
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

  _selected = false;

  get selected() {
    return this._selected;
  }

  _handleThemeUpdate(_evt: CustomEvent) {
    if (_evt.detail.theme) {
      const theme = _evt.detail.theme;
      this._updateSelected(theme);
    }
  }

  _updateSelected(theme: Theme) {
    // Start with `true`. An empty preset is always selected 🤷‍♂️
    let selected = true;

    // TODO: This would be great to implement with a generator function (using `yield`)
    // so we can stop the walk early when the first non-matching token is found.
    walkTokens(this.value, (token, path) => {
      if (!selected) {
        return;
      }
      const themeToken = theme.at(path.join('.'));
      const themeValue = themeToken ? themeToken['$value'] : null;
      const presetValue = token['$value'];
      const themeEqualsPreset = dequal(themeValue, presetValue);

      // Check if the value from the preset is the current value in the theme
      if (!themeEqualsPreset) {
        selected = false;
      }
    });

    // TODO: We could calculate this `selected` state lazily, and invalidate the cached
    // value at the `theme-update` event.
    this._selected = selected;
    this.requestUpdate();
  }
  private readonly onButtonClick = () => {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  static override readonly styles = [wizardTokenCSS];

  override render() {
    return html`
      <button aria-pressed="${this.selected ? 'true' : 'false'}" type="button" @click=${this.onButtonClick}>
        <slot></slot>
      </button>
    `;
  }
}
