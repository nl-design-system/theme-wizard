import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import CheckIcon from '@tabler/icons/filled/check.svg?raw';
import ChevronRightIcon from '@tabler/icons/outline/chevron-right.svg?raw';
import FileTypographyIcon from '@tabler/icons/outline/file-typography.svg?raw';
import PaletteIcon from '@tabler/icons/outline/palette.svg?raw';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
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
  static override readonly styles = [styles];

  @property({ type: String }) href = '';
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) done = false;

  override render() {
    const icon = isIconName(this.icon) ? ICON_MAP[this.icon] : null;

    return html`
      <clippy-task-navigation href=${this.href}>
        <span
          slot="iconStart"
          class="wizard-step-form-task-navigation-icon-start ${classMap({
            'wizard-step-form-task-navigation-icon-start--checked': this.done,
          })}"
        >
          ${unsafeSVG(this.done ? CheckIcon : icon)}
        </span>
        <slot></slot>
        <span slot="actions">${unsafeSVG(ChevronRightIcon)}</span>
      </clippy-task-navigation>
    `;
  }
}
