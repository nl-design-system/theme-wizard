import { EXTENSION_TOKEN_ID } from '@nl-design-system-community/css-scraper';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import styles from './styles';


@customElement('color-scale')
export class ColorScale extends LitElement {
  @property() label: string = '';
  @property() from?: ColorToken;
  @property() stops: ColorToken[] = [];

  static override styles = [styles];

  override render() {
    return html`
      <div>
        <p>${this.from?.$extensions?.[EXTENSION_TOKEN_ID] || ''}</p>
        <div class="theme-color-scale__list" style=${`background-color: ${this.from?.toCSSColorFunction()}`}>
          ${this.stops.map(
      (stop) => html`
              <div
                class="theme-color-scale__stop"
                style=${`background-color: ${stop.toCSSColorFunction()}`}
                title=${stop.$value.components.join(', ')}
              ></div>
            `,
    )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-scale': ColorScale;
  }
}
