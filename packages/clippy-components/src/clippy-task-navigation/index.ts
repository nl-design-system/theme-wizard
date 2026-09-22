import { safeCustomElement } from '@lib/decorators';
import { ClippyCardAsLink } from '@src/clippy-card-as-link';
import styles from './styles';

const tag = 'clippy-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTaskNavigation;
  }
}

/**
 * @slot header - Task label region
 * @slot body - Supplementary detail, e.g. a due date
 * @slot footer - Trailing content, e.g. a chevron icon
 */
@safeCustomElement(tag)
export class ClippyTaskNavigation extends ClippyCardAsLink {
  static override readonly styles = [...ClippyCardAsLink.styles, styles];
}
