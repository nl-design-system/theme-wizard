import '../wizard-layout';
import buttonCSS from '@nl-design-system-candidate/button-css/button.css?inline';
import codeBlockCSS from '@nl-design-system-candidate/code-block-css/code-block.css?inline';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCSS from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCSS from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import headingCSS from '@nl-design-system-candidate/heading-css/heading.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import numberBadgeCSS from '@nl-design-system-candidate/number-badge-css/number-badge.css?inline';
import paragraphCSS from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import skipLinkCSS from '@nl-design-system-candidate/skip-link-css/skip-link.css?inline';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getStories } from '../../utils/csf-utils';
import { storyModulesLazy, type StoryModule } from '../wizard-components-page/story-modules';
import styles from '../wizard-components-page/styles';
import '../wizard-story';
import '../wizard-story-react';
import '../wizard-story-preview';
import '@nl-design-system-community/clippy-components/clippy-heading';

// CSS strings - defer stylesheet creation to client
const cssStrings = {
  buttonCSS,
  codeBlockCSS,
  codeCSS,
  colorSampleCSS,
  dataBadgeCSS,
  headingCSS,
  linkCSS,
  markCSS,
  numberBadgeCSS,
  paragraphCSS,
  skipLinkCSS,
};

function createStyleSheets() {
  return Object.values(cssStrings).map((css) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return sheet;
  });
}


const tag = 'wizard-component-page';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardComponentPage;
  }
}

/**
 * Renders a single component with all its stories.
 * Accepts a componentId property to determine which component to render.
 */
@customElement(tag)
export class WizardComponentPage extends LitElement {
  static override readonly styles = [styles];

  @property({ attribute: 'component-id', type: String }) componentId: string | null = null;
  @state() private loadedComponent: StoryModule | null = null;
  @state() private isLoading = false;
  @state() private error: string | null = null;

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('componentId')) {
      this.loadComponent();
    }
  }

  private async loadComponent() {
    if (!this.componentId) {
      this.loadedComponent = null;
      this.error = null;
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const loader = storyModulesLazy[this.componentId];
      if (!loader) {
        this.error = `Component not found: ${this.componentId}`;
        this.loadedComponent = null;
        return;
      }

      this.loadedComponent = await loader();
    } catch (err) {
      this.error = `Failed to load component: ${err instanceof Error ? err.message : String(err)}`;
      this.loadedComponent = null;
    } finally {
      this.isLoading = false;
    }
  }

  override render() {
    if (!this.componentId) {
      return html`<p>No component specified</p>`;
    }

    if (this.isLoading) {
      return html`<p>Loading component...</p>`;
    }

    if (this.error) {
      return html`<p style="color: red;">${this.error}</p>`;
    }

    if (!this.loadedComponent) {
      return html`<p>Component not found: ${this.componentId}</p>`;
    }

    const meta = this.loadedComponent.default;
    const storyStyleSheets = createStyleSheets();

    return html`
      ${getStories(this.loadedComponent, meta).map(
        (story) => html`
          <section>
            <clippy-heading level="4">${story?.name || story?.storyName}</clippy-heading>
            <wizard-story-preview>
              <wizard-story-react
                .meta=${meta}
                .story=${story}
                .storyStyleSheets=${storyStyleSheets}
              ></wizard-story-react>
            </wizard-story-preview>
          </section>
        `,
      )}
    `;
  }
}
