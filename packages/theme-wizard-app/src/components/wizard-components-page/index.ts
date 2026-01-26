import type { Meta } from '@storybook/react-vite';
import '../wizard-layout';
import codeBlockCSS from '@nl-design-system-candidate/code-block-css/code-block.css?inline';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCSS from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import headingCSS from '@nl-design-system-candidate/heading-css/heading.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import { LitElement, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { t } from '../../i18n';
import { getStories } from '../../utils/csf-utils';
import * as CodeBlockStories from './code-block-react.stories';
import * as CodeStories from './code-react.stories';
import * as ColorSampleStories from './color-sample-react.stories';
import * as HeadingStories from './heading-react.stories';
import * as LinkStories from './link-react.stories';
import * as MarkStories from './mark-react.stories';
import styles from './styles';
import '../wizard-story';
import '../wizard-story-react';
import '../wizard-story-preview';
import '@nl-design-system-community/clippy-components/clippy-heading';

// Button
// Data Badge
// Number Badge
// Paragraph
// Skip Link

// Steps to add a new component:
// 1. pnpm add @nl-design-system-candidate/[component]-docs
// 2. pnpm add @nl-design-system-candidate/[component]-css
// 3. pnpm add @nl-design-system-candidate/[component]-react
// 4. Create [component]-react.stories.ts(x)
// 5. import [component]CSS from '@nl-design-system-candidate/[component]-css/[component].css?inline'
// 6. add to `storyStyleSheets`
// 7. import * as [Component]Stories from './[component]-react.stories';
// 8. Add to `storyModules`

const storyStyleSheets = [markCSS, linkCSS, codeCSS, colorSampleCSS, headingCSS, codeBlockCSS].map((css) => {
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

const storyModules: StoryModule[] = [
  MarkStories,
  LinkStories,
  ColorSampleStories,
  CodeStories,
  HeadingStories,
  CodeBlockStories,
].sort((a, b) => (a.default.id || a.default.title || '').localeCompare(b.default.id || b.default.title || ''));

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
          <clippy-heading level="1">${t('componentsPage.title')}</clippy-heading>

          ${storyModules.map((stories) => {
            const meta = stories.default;
            const description = meta.parameters?.['docs']?.description?.component;
            return html`
              <article id=${meta.id}>
                <clippy-heading level="2">${meta.id}</clippy-heading>
                ${description ? html`<utrecht-paragraph>${description}</utrecht-paragraph>` : nothing}

                <clippy-heading level="3">Stories</clippy-heading>
                ${getStories(stories, meta).map(
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
              </article>
            `;
          })}
        </div>
      </wizard-layout>
    `;
  }
}
