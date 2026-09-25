import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import srOnly from '@nl-design-system-community/clippy-components/lib/sr-only';
import CheckIcon from '@tabler/icons/filled/check.svg?raw';
import ArrowRightIcon from '@tabler/icons/outline/arrow-right.svg?raw';
import FileTypographyIcon from '@tabler/icons/outline/file-typography.svg?raw';
import PaletteIcon from '@tabler/icons/outline/palette.svg?raw';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-step-form-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepFormTaskNavigation;
  }
}

const ICON_MAP = {
  palette: PaletteIcon,
  typography: FileTypographyIcon,
} as const;

type IconName = keyof typeof ICON_MAP;

function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICON_MAP, name);
}

@customElement(tag)
export class WizardStepFormTaskNavigation extends LitElement {
  static override readonly styles = [srOnly, styles];

  @property({ type: String }) href = '';
  @property({ type: String }) icon = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) done = false;

  override render() {
    const icon = isIconName(this.icon) ? ICON_MAP[this.icon] : null;

    return html`
      <clippy-task-navigation>
        <span slot="header" class="wizard-step-form-task-navigation__title"> ${this.label} </span>

        <span
          slot="pre-header"
          aria-hidden="true"
          class="wizard-step-form-task-navigation__icon ${classMap({
            'wizard-step-form-task-navigation__icon--checked': this.done,
          })}"
        >
          ${unsafeSVG(this.done ? CheckIcon : icon)}
        </span>

        <span slot="footer" aria-hidden="true">${unsafeSVG(ArrowRightIcon)}</span>

        <a slot="link" href=${this.href}>
          ${t('wizard.taskNavigation.navigateTo', { item: this.label })}
          ${this.done ? `(${t('wizard.taskNavigation.done')})` : nothing}
        </a>
      </clippy-task-navigation>
    `;
  }
}
