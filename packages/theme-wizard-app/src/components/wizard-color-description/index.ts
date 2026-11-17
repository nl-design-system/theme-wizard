import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { t } from '../../i18n';
import { describeColor } from '../../lib/ColorDescription';

const tag = 'wizard-color-description';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardColorDescription;
  }
}

/**
 * Web component that accepts a color attribute (CSS color) and shows a short description based on the color's characteristics
 *
 * @see https://www.200ok.nl/tips/kleurnamen/
 */
@safeCustomElement(tag)
export class WizardColorDescription extends LitElement {
  @property({ type: String })
  color = '';

  override render() {
    return html`${describeColor(this.color, (key) => t(key) as string)}`;
  }
}
