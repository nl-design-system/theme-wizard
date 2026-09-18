import amsDialogStyles from '@amsterdam/design-system-css/dist/dialog/dialog.css?inline';
import { safeCustomElement } from '@lib/decorators';
import buttonStyles from '@nl-design-system-candidate/button-css/button.css?inline';
import { ClippyModal } from '@src/clippy-modal';
import { unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-drawer';

/**
 * Clippy Drawer Component
 *
 * @cssprop --clippy-drawer-max-inline-size - Maximum width of the drawer
 * @cssprop --clippy-drawer-backdrop-min-size - Size of the space left for the backdrop on the side
 */
@safeCustomElement(tag)
export class ClippyDrawer extends ClippyModal {
  static override readonly styles = [unsafeCSS(amsDialogStyles), unsafeCSS(buttonStyles), styles];

  @property({ reflect: true, type: String })
  side: 'inline-start' | 'inline-end' = 'inline-start';
}
