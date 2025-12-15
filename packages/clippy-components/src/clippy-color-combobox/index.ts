import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline'
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import colorComboboxStyles from './styles';

type Option = {
  label: string;
  value: string;
};

const tag = 'clippy-color-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorCombobox;
  }
}

@customElement(tag)
export class ClippyColorCombobox extends ClippyCombobox<Option> {
  static override readonly styles = [...ClippyCombobox.styles, colorComboboxStyles, unsafeCSS(colorSampleStyles)];

  override readonly filter = (option: Option) => {
    const label = `${option.label}`; // Use as string
    return label.toLowerCase().includes(this.query.toLowerCase());
  };

  override valueToQuery(value: Option['value']): string {
    return Array.isArray(value) ? value[0] : value.split(',')[0];
  }

  override renderEntry(option: Option) {
    const color = option.value;
    return html`
      <span class="clippy-color-combobox__option">
        <svg role="img" xmlns="http://www.w3.org/2000/svg" class="nl-color-sample" style=${styleMap({ color })}>
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
        <span>${option.label}</span>
      </span>
    `;
  }
}
