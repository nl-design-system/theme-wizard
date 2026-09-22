import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-card';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCard;
  }
}

/**
 * Non-interactive bare card. Provides the pre-header/header/body/footer regions and a generic
 * card design-token surface. Usable standalone, or as the base for card-shaped components that
 * slot content in or extend the class — e.g. `clippy-card-as-link` (appearance variants) or
 * `clippy-card-radio-option` (a selectable card).
 *
 * @slot link - Reserved for card-as-link variants (e.g. `clippy-card-as-link`) — a direct-child
 *   `<a>` here is rendered inert unless paired with such a variant's styles
 * @slot pre-header - Content above the header, e.g. a status or category label
 * @slot header - Card heading region
 * @slot body - Main card content
 * @slot footer - Footer content, e.g. actions or metadata
 *
 * @cssprop --clippy-card-background-color - background color
 * @cssprop --clippy-card-border-color - border color
 * @cssprop --clippy-card-border-radius - border radius
 * @cssprop --clippy-card-border-width - border width
 * @cssprop --clippy-card-color - color
 * @cssprop --clippy-card-max-inline-size - max inline size
 * @cssprop --clippy-card-min-block-size - min block size
 * @cssprop --clippy-card-body-column-gap - body column gap
 * @cssprop --clippy-card-body-padding-block-end - body padding block end
 * @cssprop --clippy-card-body-padding-block-start - body padding block start
 * @cssprop --clippy-card-body-padding-inline-end - body padding inline end
 * @cssprop --clippy-card-body-padding-inline-start - body padding inline start
 * @cssprop --clippy-card-body-row-gap - body row gap
 * @cssprop --clippy-card-description-font-size - description font size
 * @cssprop --clippy-card-description-line-height - description line height
 * @cssprop --clippy-card-footer-column-gap - footer column gap
 * @cssprop --clippy-card-footer-padding-block-end - footer padding block end
 * @cssprop --clippy-card-footer-padding-block-start - footer padding block start
 * @cssprop --clippy-card-footer-padding-inline-end - footer padding inline end
 * @cssprop --clippy-card-footer-padding-inline-start - footer padding inline start
 * @cssprop --clippy-card-footer-row-gap - footer row gap
 * @cssprop --clippy-card-header-column-gap - header column gap
 * @cssprop --clippy-card-header-padding-block-end - header padding block end
 * @cssprop --clippy-card-header-padding-block-start - header padding block start
 * @cssprop --clippy-card-header-padding-inline-end - header padding inline end
 * @cssprop --clippy-card-header-padding-inline-start - header padding inline start
 * @cssprop --clippy-card-header-row-gap - header row gap
 * @cssprop --clippy-card-heading-color - heading color
 * @cssprop --clippy-card-heading-font-family - heading font family
 * @cssprop --clippy-card-heading-font-size - heading font size
 * @cssprop --clippy-card-heading-font-weight - heading font weight
 * @cssprop --clippy-card-heading-line-height - heading line height
 * @cssprop --clippy-card-heading-text-decoration - heading text decoration
 * @cssprop --clippy-card-icon-color - icon color
 * @cssprop --clippy-card-icon-size - icon size
 * @cssprop --clippy-card-label-color - label color
 * @cssprop --clippy-card-label-font-family - label font family
 * @cssprop --clippy-card-label-font-size - label font size
 * @cssprop --clippy-card-label-font-weight - label font weight
 * @cssprop --clippy-card-label-line-height - label line height
 * @cssprop --clippy-card-label-text-decoration - label text decoration
 * @cssprop --clippy-card-link-icon-color - link icon color
 * @cssprop --clippy-card-link-icon-size - link icon size
 * @cssprop --clippy-card-pre-header-column-gap - pre header column gap
 * @cssprop --clippy-card-pre-header-padding-block-end - pre header padding block end
 * @cssprop --clippy-card-pre-header-padding-block-start - pre header padding block start
 * @cssprop --clippy-card-pre-header-padding-inline-end - pre header padding inline end
 * @cssprop --clippy-card-pre-header-padding-inline-start - pre header padding inline start
 * @cssprop --clippy-card-pre-header-row-gap - pre header row gap
 */
@safeCustomElement(tag)
export class ClippyCard extends LitElement {
  static override readonly styles = [styles];

  @state() protected hasPreHeader = false;
  @state() protected hasHeader = false;
  @state() protected hasBody = false;
  @state() protected hasFooter = false;

  protected readonly onPreHeaderSlotChange = (event: Event) => {
    this.hasPreHeader = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  protected readonly onHeaderSlotChange = (event: Event) => {
    this.hasHeader = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  protected readonly onBodySlotChange = (event: Event) => {
    this.hasBody = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  protected readonly onFooterSlotChange = (event: Event) => {
    this.hasFooter = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  protected hasAssignedNodes(slotName: string): boolean {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${slotName}"]`);
    return (slot?.assignedNodes({ flatten: true }).length ?? 0) > 0;
  }

  protected override firstUpdated() {
    this.hasPreHeader = this.hasAssignedNodes('pre-header');
    this.hasHeader = this.hasAssignedNodes('header');
    this.hasBody = this.hasAssignedNodes('body');
    this.hasFooter = this.hasAssignedNodes('footer');
  }

  protected renderPreHeader() {
    return this.hasPreHeader
      ? html`<div class="clippy-card__pre-header">
          <slot name="pre-header" @slotchange=${this.onPreHeaderSlotChange}></slot>
        </div>`
      : html`<slot name="pre-header" @slotchange=${this.onPreHeaderSlotChange}></slot>`;
  }

  protected renderHeader() {
    return this.hasHeader
      ? html`<div class="clippy-card__header">
          <slot name="header" @slotchange=${this.onHeaderSlotChange}></slot>
        </div>`
      : html`<slot name="header" @slotchange=${this.onHeaderSlotChange}></slot>`;
  }

  protected renderBody() {
    return this.hasBody
      ? html`<div class="clippy-card__body">
          <slot name="body" @slotchange=${this.onBodySlotChange}></slot>
        </div>`
      : html`<slot name="body" @slotchange=${this.onBodySlotChange}></slot>`;
  }

  protected renderFooter() {
    return this.hasFooter
      ? html`<div class="clippy-card__footer">
          <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
        </div>`
      : html`<slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>`;
  }

  override render() {
    // Header (then the reserved link slot) renders before pre-header in the DOM/shadow-tree
    // order — that's what drives assistive-technology reading order (the flattened tree), not
    // light-DOM author order. The pre-header is still shown visually above the header via CSS
    // `order` (see styles.ts).
    return html`${this.renderHeader()}
      <slot name="link"></slot>
      ${this.renderPreHeader()}${this.renderBody()}${this.renderFooter()}`;
  }
}
