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
import { LitElement, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getStories } from '../../utils/csf-utils';
import { storyModules } from './story-modules';
import styles from './styles';
import '../wizard-story';
import '../wizard-story-react';
import '../wizard-story-preview';
import '@nl-design-system-community/clippy-components/clippy-heading';

// Steps to add a new component:
// 1. pnpm add @nl-design-system-candidate/[component]-docs
// 2. pnpm add @nl-design-system-candidate/[component]-css
// 3. pnpm add @nl-design-system-candidate/[component]-react
// 4. pnpm add @nl-design-system-candidate/[component]-tokens
// 4. Create [component]-react.stories.ts(x) (Copy via https://github.com/frameless/candidate/blob/main/packages/docs/)
// 5. import [component]CSS from '@nl-design-system-candidate/[component]-css/[component].css?inline'
// 6. add to `storyStyleSheets`
// 7. import * as [Component]Stories from './[component]-react.stories';
// 8. Add to `storyModules`

const storyStyleSheets = [
  markCSS,
  linkCSS,
  codeCSS,
  colorSampleCSS,
  dataBadgeCSS,
  headingCSS,
  codeBlockCSS,
  paragraphCSS,
  numberBadgeCSS,
  skipLinkCSS,
  buttonCSS,
].map((css) => {
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

const sortedStoryModules = [...storyModules].sort((a, b) => (a.default.id || a.default.title || '').localeCompare(b.default.id || b.default.title || ''));

@customElement(tag)
export class WizardComponentsPage extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <!--<nav>
        ${sortedStoryModules.map((storyModule) => {
        const hash = `#${storyModule.default.id}`;
        return html`<a class="wizard-styleguide__nav-item" href=${hash}>${storyModule.default.id}</a>`;
      })}
      </nav>-->

      <div>
        ${storyModules.map((component) => {
          const meta = component.default;
          const description = meta.parameters?.['docs']?.description?.component;
          return html`
            <article id=${meta.id}>
              <clippy-heading level="2">${meta.id}</clippy-heading>
              ${description ? html`<utrecht-paragraph>${description}</utrecht-paragraph>` : nothing}

              <clippy-heading level="3">Stories</clippy-heading>
              ${getStories(component, meta).map(
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
    `;
  }
}
