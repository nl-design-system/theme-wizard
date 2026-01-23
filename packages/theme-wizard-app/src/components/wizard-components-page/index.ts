import { consume } from '@lit/context';
import '../wizard-layout';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import * as CodeStories from './code-react.stories';
import * as ColorSampleStories from './color-sample-react.stories';
import * as LinkStories from './link-react.stories';
import * as MarkStories from './mark-react.stories';
import styles from './styles';
import './wizard-story';
import './wizard-story-preview';
import './wizard-code-block';

const tag = 'wizard-components-page';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardComponentsPage;
  }
}

const getStories = (stories: Record<string, unknown>) => {
  // Filter out the default export
  return Object.entries(stories)
    .filter(([storyName]) => storyName !== 'default')
    .map(([, story]) => story as any);
};

@customElement(tag)
export class WizardComponentsPage extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

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
    if (!this.theme) {
      return t('loading');
    }

    return html`
      <wizard-layout>
        <nav slot="sidebar" class="wizard-styleguide__nav"></nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('componentsPage.title')}</utrecht-heading-1>

          <article>
            <utrecht-heading-2>${MarkStories.default.id}</utrecht-heading-2>
            <utrecht-paragraph>${MarkStories.default.parameters?.docs?.description?.component}</utrecht-paragraph>
            <!--<pre>${JSON.stringify(MarkStories.default.parameters, null, 2)}</pre>-->

            <utrecht-heading-3>Stories</utrecht-heading-3>
            ${getStories(MarkStories).map((story) => {
              const meta = MarkStories.default;
              return html`
                <section>
                  <utrecht-heading-4>${story?.name}</utrecht-heading-4>
                  <pre>${JSON.stringify(story?.parameters?.tokens, null, 2)}</pre>
                  <wizard-story-preview>
                    <wizard-story .meta=${meta} .story=${story}></wizard-story>
                  </wizard-story-preview>
                </section>
              `;
            })}
          </article>

          <article>
            <utrecht-heading-2>${LinkStories.default.id}</utrecht-heading-2>
            <utrecht-paragraph>${LinkStories.default.parameters?.docs?.description?.component}</utrecht-paragraph>
            <!--<pre>${JSON.stringify(LinkStories.default, null, 2)}</pre>-->

            <utrecht-heading-3>Stories</utrecht-heading-3>
            ${getStories(LinkStories).map((story) => {
              const meta = LinkStories.default;
              return html`
                <section>
                  <utrecht-heading-4>${story?.name}</utrecht-heading-4>
                  <pre>${JSON.stringify(story?.parameters?.tokens, null, 2)}</pre>
                  <wizard-story-preview>
                    <wizard-story .meta=${meta} .story=${story}></wizard-story>
                  </wizard-story-preview>
                </section>
              `;
            })}
          </article>

          <article>
            <utrecht-heading-2>${ColorSampleStories.default.id}</utrecht-heading-2>
            <utrecht-paragraph>
              ${ColorSampleStories.default.parameters?.docs?.description?.component}
            </utrecht-paragraph>
            <!--<pre>${JSON.stringify(ColorSampleStories.default, null, 2)}</pre>-->

            <utrecht-heading-3>Stories</utrecht-heading-3>
            ${getStories(ColorSampleStories).map((story) => {
              const meta = ColorSampleStories.default;
              return html`
                <section>
                  <utrecht-heading-4>${story?.name}</utrecht-heading-4>
                  <pre>${JSON.stringify(story?.parameters?.tokens, null, 2)}</pre>
                  <wizard-story-preview>
                    <wizard-story .meta=${meta} .story=${story}></wizard-story>
                  </wizard-story-preview>
                </section>
              `;
            })}
          </article>

          <article>
            <utrecht-heading-2>${CodeStories.default.id}</utrecht-heading-2>
            <utrecht-paragraph> ${CodeStories.default.parameters?.docs?.description?.component} </utrecht-paragraph>
            <!--<pre>${JSON.stringify(CodeStories.default, null, 2)}</pre>-->

            <utrecht-heading-3>Stories</utrecht-heading-3>
            ${getStories(CodeStories).map((story) => {
              const meta = CodeStories.default;
              return html`
                <section>
                  <utrecht-heading-4>${story?.name}</utrecht-heading-4>
                  <pre>${JSON.stringify(story?.parameters?.tokens, null, 2)}</pre>
                  <wizard-story-preview>
                    <wizard-story .meta=${meta} .story=${story}></wizard-story>
                  </wizard-story-preview>
                </section>
              `;
            })}
          </article>
        </div>
      </wizard-layout>
    `;
  }
}
