import { ColorToken, stringifyColor } from '@nl-design-system-community/design-tokens-schema';
import { type TemplateResult, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyTokenComboboxOption } from '.';

export const preview = (option: ClippyTokenComboboxOption & { value: ColorToken }): TemplateResult | typeof nothing => {
  // Ensure the option is a color token
  if (option.value.$type !== 'color') return nothing;

  const colorValue = option.value.$value.toString() ?? stringifyColor(option.value.$value);
  return colorValue
    ? html`
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          class="wizard-token-combobox__preview nl-color-sample"
          style=${styleMap({ color: colorValue })}
        >
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
      `
    : nothing;
};
