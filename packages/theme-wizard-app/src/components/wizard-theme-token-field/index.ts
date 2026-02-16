import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
import Theme from '../../lib/Theme';
import { WizardTokenField } from '../wizard-token-field';

const tag = 'wizard-theme-token-field';

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
  }
}
