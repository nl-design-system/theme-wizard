import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
import PersistentStorage from '../../lib/PersistentStorage';
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
  private readonly storage = new PersistentStorage({ prefix: 'theme-wizard' });

  override connectedCallback(): void {
    super.connectedCallback();
    this.token = this.theme.at(this.path);

    this.addEventListener('change', (event) => {
      const target = event.target;
      this.errors = this.pathErrors;

      if (target instanceof WizardThemeTokenField) {
        this.theme.updateAt(target.path, this._inputValue);
        this.storage.setJSON(this.theme.tokens);
      }
    });
  }
}
