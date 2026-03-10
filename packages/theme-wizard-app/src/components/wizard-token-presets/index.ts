import { consume } from '@lit/context';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
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
  //   private readonly theme!: Theme;
  private readonly onButtonClick = () => {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  static override readonly styles = [unsafeCSS(wizardTokenCSS)];

  override render() {
    return html` <button aria-pressed="false" type="button" @click=${this.onButtonClick}><slot></slot></button> `;
  }
}
