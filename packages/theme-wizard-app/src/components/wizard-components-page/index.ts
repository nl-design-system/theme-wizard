import type { Meta } from '@storybook/react-vite';
import '../wizard-layout';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCSS from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import { LitElement, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { t } from '../../i18n';
import * as CodeStories from './code-react.stories';
import * as ColorSampleStories from './color-sample-react.stories';
import { getStories } from './csf-utils';
import * as LinkStories from './link-react.stories';
import * as MarkStories from './mark-react.stories';
import './wizard-story';
import './wizard-story-react';
import './wizard-story-preview';
import './wizard-code-block';
import styles from './styles';

const storyStyleSheets = [markCSS, linkCSS, codeCSS, colorSampleCSS].map((css) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
});

const tag = 'wizard-components-page';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardComponentsPage;
  }
}

/**
 * Component Story Format module structure.
 * Enforces that CSF modules have a default export (Meta),
 * and any number of story exports (various prop types).
 */
type StoryModule = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: Meta<any>;
  [key: string]: unknown;
};

const storyModules: StoryModule[] = [MarkStories, LinkStories, ColorSampleStories, CodeStories].sort((a, b) =>
  (a.default.id || a.default.title || '').localeCompare(b.default.id || b.default.title || ''),
);

@customElement(tag)
export class WizardComponentsPage extends LitElement {
  static override readonly styles = [styles];

  override connectedCallback(): void {
    super.connectedCallback();
    document.title = t('componentsPage.title').toString();
  }

  override firstUpdated(): void {
    // Scroll to hash on page load
    const hash = globalThis.location.hash;
    if (hash) {
      this.#scrollToHash(hash);
    }
  }

  #handleNavClick(event: Event): void {
    const link = (event.target as Element).closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    globalThis.location.hash = href;
    this.#scrollToHash(href);
  }

  #scrollToHash(hash: string): void {
    const target = this.shadowRoot?.querySelector(hash) || document.querySelector(hash);
    if (target) {
      // Use requestAnimationFrame to ensure element is rendered
      requestAnimationFrame(() => {
        target.scrollIntoView();
      });
    }
  }

  override render() {
    return html`
      <wizard-layout>
        <nav slot="sidebar" class="wizard-styleguide__nav" @click=${this.#handleNavClick}>
          ${storyModules.map((storyModule) => {
            const hash = `#${storyModule.default.id}`;
            return html`<a class="wizard-styleguide__nav-item" href=${hash}>${storyModule.default.id}</a>`;
          })}
        </nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('componentsPage.title')}</utrecht-heading-1>

          ${storyModules.map((stories) => {
            const meta = stories.default;
            const description = meta.parameters?.['docs']?.description?.component;
            return html`
              <article id=${meta.id}>
                <utrecht-heading-2>${meta.id}</utrecht-heading-2>
                ${description ? html`<utrecht-paragraph>${description}</utrecht-paragraph>` : nothing}

                <utrecht-heading-3>Stories</utrecht-heading-3>
                ${getStories(stories, meta).map(
                  (story) => html`
                    <section>
                      <utrecht-heading-4>${story?.name || story?.storyName}</utrecht-heading-4>
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
              </article>
            `;
          })}
        </div>
      </wizard-layout>
    `;
  }
}
