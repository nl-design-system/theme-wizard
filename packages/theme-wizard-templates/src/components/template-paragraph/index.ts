import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { unsafeCSS, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TemplatePresetTarget, presetTargetStyles } from '../template-preset-target';

@customElement('template-paragraph')
export class TemplateParagraph extends TemplatePresetTarget {
  @property() lead = false;

  protected override readonly presetComponentId = 'paragraph';

  protected override get presetDetail() {
    return { lead: this.lead };
  }

  protected override get presetAriaLabel() {
    return this.lead ? 'Lead paragraph aanpassen' : 'Paragraph aanpassen';
  }

  static override readonly styles = [presetTargetStyles, unsafeCSS(paragraphCss)];

  override render() {
    return html`<p class="nl-paragraph ${this.lead ? 'nl-paragraph--lead' : ''}">
      <slot></slot>
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-paragraph': TemplateParagraph;
  }
}
