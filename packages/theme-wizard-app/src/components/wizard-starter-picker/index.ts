import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import '@nl-design-system-community/clippy-components/clippy-stack';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import IconFileCode from '@tabler/icons/outline/file-code.svg?raw';
import IconFileSpark from '@tabler/icons/outline/file-spark.svg?raw';
import IconLink from '@tabler/icons/outline/link.svg?raw';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { t } from '../../i18n';
import styles from './styles';

export type StarterOptionValue = 'start' | 'url' | 'json';

export interface WizardStarterPickerSubmitEventDetail {
  value: StarterOptionValue;
}

export const WIZARD_STARTER_PICKER_SUBMIT_EVENT = 'wizard-starter-picker-submit';

const tag = 'wizard-starter-picker';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStarterPicker;
  }
}

/**
 * @fires {CustomEvent<WizardStarterPickerSubmitEventDetail>} wizard-starter-picker-submit - Fired on form submit with the chosen starter value.
 */
@safeCustomElement(tag)
export class WizardStarterPicker extends LitElement {
  @property({ type: String }) value: StarterOptionValue | '' = '';

  static override readonly styles = [unsafeCSS(buttonCss), styles];

  readonly #handleSubmit = (event: SubmitEvent) => {
    // Prevent a GET request to the current page with ?starter=url
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const value = new FormData(form).get('starter') as StarterOptionValue | null;

    // Should not be possible, but we're playing safe
    if (!value) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<WizardStarterPickerSubmitEventDetail>(WIZARD_STARTER_PICKER_SUBMIT_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  };

  override render() {
    return html`
      <form @submit=${this.#handleSubmit}>
        <clippy-stack size="2xl">
          <fieldset class="wizard-starter-picker__fieldset">
            <legend class="wizard-starter-picker__legend">${t('wizard.starterPicker.groupLabel')}</legend>

            <clippy-card-radio-group name="starter" value="url">
              <clippy-card-radio-option value="url" class="wizard-starter-picker__option">
                <span class="wizard-starter-picker__icon" slot="start">${unsafeSVG(IconLink)}</span>
                ${t('wizard.starterPicker.url.name')}
                <span slot="description">${t('wizard.starterPicker.url.description')}</span>
              </clippy-card-radio-option>

              <clippy-card-radio-option value="json" class="wizard-starter-picker__option">
                <span class="wizard-starter-picker__icon" slot="start">${unsafeSVG(IconFileCode)}</span>
                ${t('wizard.starterPicker.json.name')}
                <span slot="description">${t('wizard.starterPicker.json.description')}</span>
              </clippy-card-radio-option>

              <clippy-card-radio-option value="start" class="wizard-starter-picker__option">
                <span class="wizard-starter-picker__icon" slot="start">${unsafeSVG(IconFileSpark)}</span>
                ${t('wizard.starterPicker.startTheme.name')}
                <span slot="description">${t('wizard.starterPicker.startTheme.description')}</span>
              </clippy-card-radio-option>
            </clippy-card-radio-group>
          </fieldset>

          <button class="nl-button nl-button--primary" type="submit">${t('wizard.starterPicker.submit')}</button>
        </clippy-stack>
      </form>
    `;
  }
}
