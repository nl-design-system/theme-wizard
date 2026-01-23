import type { Meta } from '@storybook/react-vite';
import '../wizard-layout';
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

const storyModules: StoryModule[] = [MarkStories, LinkStories, ColorSampleStories, CodeStories];

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
        <nav slot="sidebar" class="wizard-styleguide__nav"></nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('componentsPage.title')}</utrecht-heading-1>

          ${storyModules.map((stories) => {
            const meta = stories.default;
            const description = meta.parameters?.['docs']?.description?.component;
            return html`
              <article>
                <utrecht-heading-2>${meta.id}</utrecht-heading-2>
                ${description ? html`<utrecht-paragraph>${description}</utrecht-paragraph>` : nothing}
                <!--<pre>${JSON.stringify(meta.parameters, null, 2)}</pre>-->

                <utrecht-heading-3>Stories</utrecht-heading-3>
                ${getStories(stories, meta).map(
                  (story) => html`
                    <section>
                      <utrecht-heading-4>${story?.name || story?.storyName}</utrecht-heading-4>
                      <!--<pre>${JSON.stringify(story?.parameters?.['tokens'], null, 2)}</pre>-->
                      <wizard-story-preview>
                        <wizard-story-react .meta=${meta} .story=${story}></wizard-story-react>
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
