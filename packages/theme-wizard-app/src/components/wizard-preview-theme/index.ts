import { consume } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-preview-theme';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: PreviewTheme;
  }
}

@customElement(tag)
export class PreviewTheme extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  override connectedCallback() {
    super.connectedCallback();

    this.shadowRoot?.adoptedStyleSheets.push(this.theme.stylesheet);
  }
  protected override render() {
    return html`<slot></slot>`;
  }
}
