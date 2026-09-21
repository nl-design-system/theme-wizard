import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-card-as-link';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLink;
  }
}

export type CardAsLinkAppearance = 'default' | 'case' | 'plan' | 'product' | 'task' | 'topic' | 'toptask';

const appearances: CardAsLinkAppearance[] = ['default', 'case', 'plan', 'product', 'task', 'topic', 'toptask'];

/**
 * Extends `clippy-card` with the 7 "card-as-link" appearance variants (design tokens from the
 * NL Design System ToDo Bibliotheek) and an `archived` modifier. Inherits the pre-header/header/
 * body/footer regions and generic design-token surface from `clippy-card` unchanged — only
 * `appearance`/`archived` and their variant-specific tokens live here.
 *
 * @slot pre-header - Content above the header, e.g. a status or category label
 * @slot header - Card heading region
 * @slot body - Main card content
 * @slot footer - Footer content, e.g. actions or metadata
 *
 * @cssprop --clippy-card-case-background-color - case background color
 * @cssprop --clippy-card-case-border-color - case border color
 * @cssprop --clippy-card-case-color - case color
 * @cssprop --clippy-card-case-min-block-size - case min block size
 * @cssprop --clippy-card-case-decoration-background-color - case decoration background color
 * @cssprop --clippy-card-case-decoration-paper-background-color - case decoration paper background color
 * @cssprop --clippy-card-case-decoration-paper-border-radius - case decoration paper border radius
 * @cssprop --clippy-card-case-heading-color - case heading color
 * @cssprop --clippy-card-case-archived-background-color - case archived background color
 * @cssprop --clippy-card-case-archived-border-color - case archived border color
 * @cssprop --clippy-card-case-archived-color - case archived color
 * @cssprop --clippy-card-case-archived-decoration-background-color - case archived decoration background color
 * @cssprop --clippy-card-case-archived-heading-color - case archived heading color
 * @cssprop --clippy-card-case-archived-link-icon-color - case archived link icon color
 * @cssprop --clippy-card-plan-background-color - plan background color
 * @cssprop --clippy-card-plan-border-color - plan border color
 * @cssprop --clippy-card-plan-border-width - plan border width
 * @cssprop --clippy-card-plan-color - plan color
 * @cssprop --clippy-card-plan-min-block-size - plan min block size
 * @cssprop --clippy-card-plan-decoration-clip-color - plan decoration clip color
 * @cssprop --clippy-card-plan-body-padding-inline-end - plan body padding inline end
 * @cssprop --clippy-card-plan-body-padding-inline-start - plan body padding inline start
 * @cssprop --clippy-card-plan-footer-padding-block-end - plan footer padding block end
 * @cssprop --clippy-card-plan-footer-padding-inline-end - plan footer padding inline end
 * @cssprop --clippy-card-plan-footer-padding-inline-start - plan footer padding inline start
 * @cssprop --clippy-card-plan-header-padding-inline-end - plan header padding inline end
 * @cssprop --clippy-card-plan-header-padding-inline-start - plan header padding inline start
 * @cssprop --clippy-card-plan-heading-color - plan heading color
 * @cssprop --clippy-card-plan-link-icon-color - plan link icon color
 * @cssprop --clippy-card-plan-archived-background-color - plan archived background color
 * @cssprop --clippy-card-plan-archived-border-color - plan archived border color
 * @cssprop --clippy-card-plan-archived-color - plan archived color
 * @cssprop --clippy-card-plan-archived-heading-color - plan archived heading color
 * @cssprop --clippy-card-plan-archived-link-icon-color - plan archived link icon color
 * @cssprop --clippy-card-plan-archived-decoration-clip-color - plan archived decoration clip color
 * @cssprop --clippy-card-product-border-block-start-color - product border block start color
 * @cssprop --clippy-card-product-border-block-start-width - product border block start width
 * @cssprop --clippy-card-product-border-radius - product border radius
 * @cssprop --clippy-card-task-border-radius - task border radius
 * @cssprop --clippy-card-task-border-width - task border width
 * @cssprop --clippy-card-task-body-padding-block-start - task body padding block start
 * @cssprop --clippy-card-task-footer-padding-inline-start - task footer padding inline start
 * @cssprop --clippy-card-task-pre-header-padding-block-end - task pre header padding block end
 * @cssprop --clippy-card-task-pre-header-padding-block-start - task pre header padding block start
 * @cssprop --clippy-card-task-pre-header-padding-inline-start - task pre header padding inline start
 * @cssprop --clippy-card-task-checked-icon-color - task checked icon color
 * @cssprop --clippy-card-topic-border-radius - topic border radius
 * @cssprop --clippy-card-topic-border-width - topic border width
 * @cssprop --clippy-card-topic-icon-color - topic icon color
 * @cssprop --clippy-card-topic-icon-size - topic icon size
 * @cssprop --clippy-card-topic-pre-header-padding-block-start - topic pre header padding block start
 * @cssprop --clippy-card-topic-pre-header-padding-inline-start - topic pre header padding inline start
 * @cssprop --clippy-card-toptask-background-color - toptask background color
 * @cssprop --clippy-card-toptask-border-color - toptask border color
 * @cssprop --clippy-card-toptask-color - toptask color
 * @cssprop --clippy-card-toptask-icon-size - toptask icon size
 * @cssprop --clippy-card-toptask-label-color - toptask label color
 * @cssprop --clippy-card-toptask-pre-header-padding-block-start - toptask pre header padding block start
 * @cssprop --clippy-card-toptask-pre-header-padding-inline-start - toptask pre header padding inline start
 */
@safeCustomElement(tag)
export class ClippyCardAsLink extends ClippyCard {
  static override readonly styles = [...ClippyCard.styles, styles];

  @property({
    converter: {
      fromAttribute: (value: string | null): CardAsLinkAppearance => {
        if (value && (appearances as string[]).includes(value)) {
          return value as CardAsLinkAppearance;
        }
        if (value) console.warn(`Invalid appearance "${value}". Using default "default".`);
        return 'default';
      },
    },
    reflect: true,
    type: String,
  })
  appearance: CardAsLinkAppearance = 'default';

  @property({ reflect: true, type: Boolean }) archived = false;
}
