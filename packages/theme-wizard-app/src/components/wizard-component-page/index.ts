import type { Meta } from '@storybook/react-vite';
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
import { customElement, property } from 'lit/decorators.js';
import { getStories } from '../../utils/csf-utils';
import * as ButtonStories from '../wizard-components-page/button-react.stories';
import * as CodeBlockStories from '../wizard-components-page/code-block-react.stories';
import * as CodeStories from '../wizard-components-page/code-react.stories';
import * as ColorSampleStories from '../wizard-components-page/color-sample-react.stories';
import * as DataBadgeStories from '../wizard-components-page/data-badge-react.stories';
import * as HeadingStories from '../wizard-components-page/heading-react.stories';
import * as LinkStories from '../wizard-components-page/link-react.stories';
import * as MarkStories from '../wizard-components-page/mark-react.stories';
import * as NumberBadgeStories from '../wizard-components-page/number-badge-react.stories';
import * as ParagraphStories from '../wizard-components-page/paragraph-react.stories';
import * as SkipLinkStories from '../wizard-components-page/skip-link-react.stories';
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
  ParagraphStories,
  DataBadgeStories,
  NumberBadgeStories,
  SkipLinkStories,
  ButtonStories,
];

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

  override render() {
    if (!this.componentId) {
      return html`<p>No component specified</p>`;
    }

    const component = storyModules.find((m) => m.default.id === this.componentId);
    if (!component) {
      return html`<p>Component not found: ${this.componentId}</p>`;
    }

    const meta = component.default;
    const storyStyleSheets = createStyleSheets();

    return html`
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
    `;
  }
}
