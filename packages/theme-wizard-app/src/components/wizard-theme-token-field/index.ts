import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
import Theme from '../../lib/Theme';
import { WizardTokenField } from '../wizard-token-field';

const tag = 'wizard-theme-token-field';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardThemeTokenField;
  }
}

@customElement(tag)
export class WizardThemeTokenField extends WizardTokenField {
  @consume({ context: themeContext })
  private readonly theme!: Theme;
  override connectedCallback(): void {
    super.connectedCallback();
    this.token = this.theme.at(this.path);
    this.addEventListener('change', (evt) => {
      const target = evt.target;
      this.errors = this.pathErrors;

      if (target instanceof WizardThemeTokenField) {
        this.theme.updateAt(target.path, this._inputValue);
      }
    });
  }
}
