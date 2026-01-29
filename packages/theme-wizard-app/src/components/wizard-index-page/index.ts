import type { PropertyValues } from 'lit';
import { consume } from '@lit/context';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../wizard-scraper';
import type Theme from '../../lib/Theme';
import type { TemplateGroup } from '../wizard-preview-picker';
import { EVENT_NAMES } from '../../constants';
import { themeContext } from '../../contexts/theme';
import { PREVIEW_PICKER_NAME } from '../wizard-preview-picker';
import '@nl-design-system-community/clippy-components/clippy-heading';
import styles from './styles';

const tag = 'wizard-index-page';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardIndexPage;
  }
}

@customElement(tag)
export class WizardIndexPage extends LitElement {
  static override readonly styles = [unsafeCSS(buttonLinkStyles), styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ attribute: false })
  templates: TemplateGroup[] = [];

  @state()
  private selectedTemplatePath: string = '';

  /**
   * Get fallback template path using same logic as wizard-preview-picker
   */
  #getFallbackTemplatePath(): string {
    const firstGroup = this.templates?.[0];
    const firstOption = firstGroup?.pages?.[0];
    return firstOption?.value ?? '';
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);

    // Parse template selection from query param: ?templatePath=/group/page (dynamic)
    try {
      const templatePath = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME);
      if (templatePath) {
        this.selectedTemplatePath = templatePath;
      } else if (this.templates.length > 0) {
        // If templates are already available, use fallback
        this.selectedTemplatePath = this.#getFallbackTemplatePath();
      }
    } catch {
      // ignore parsing errors
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // When templates become available and selectedTemplatePath is empty, use fallback
    if (changedProperties.has('templates') && !this.selectedTemplatePath) {
      this.selectedTemplatePath = this.#getFallbackTemplatePath();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);
  }

  readonly #handleTemplateChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    this.selectedTemplatePath = event.detail as string;
  };

  override render() {
    if (!this.theme) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <div slot="nav" class="wizard-app__nav">
        <wizard-preview-picker .templates=${this.templates}></wizard-preview-picker>
      </div>

      <section aria-label="Live voorbeeld van toegepaste huisstijl">
        <wizard-preview .url=${this.selectedTemplatePath} .themeStylesheet=${this.theme.stylesheet}></wizard-preview>
      </section>
    `;
  }
}
