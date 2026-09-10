import { consume } from '@lit/context';
import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { LitElement, html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import '../wizard-story-section';
import {
  findMatchingStories,
  prepareStoryCandidates,
  type ComponentStoriesRegistry,
  type StoryCandidate,
  type StoryMatch,
} from '../../utils/story-token-matches';
import styles from './styles';

const tag = 'wizard-story-matches';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryMatches;
  }
}

/**
 * Renders every story whose editable tokens resolve, in the live theme, to one of `groups`
 * (dot-separated basis token paths). Stays in sync with theme edits via the theme context.
 */
@customElement(tag)
export class WizardStoryMatches extends LitElement {
  static override readonly styles = [unsafeCSS(paragraphStyles), styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  // Consumers will pass in `<wizard-story-matches groups="basis.color.default, basis.color-accent-1">
  @property({ converter: arrayFromCommaList })
  groups: string[] = [];

  // Caller-supplied registry of which components/stories exist — the caller owns those
  // files, this component only knows how to match against them.
  @property({ attribute: false })
  components: ComponentStoriesRegistry = {};

  @state() private storyMatches: StoryMatch[] = [];

  // Reflects to the `hidden` attribute so callers can hide surrounding chrome (e.g. a
  // heading) with `.wrapper:has(wizard-story-matches:not([hidden]))`
  override hidden = true;

  // Stories don't change at runtime, so loading & walking them (`prepareStoryCandidates`) only
  // needs to happen once per `components` assignment — every theme/group change afterwards just
  // re-resolves ref chains against this cached list, which is cheap and synchronous.
  #candidates: StoryCandidate[] = [];

  // Guards against a slower, earlier prepare run overwriting a newer one.
  #prepareRun = 0;

  protected override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('components')) {
      this.#prepareCandidates();
      return;
    }

    if (changedProperties.has('theme') || changedProperties.has('groups')) {
      this.#recomputeMatches();
    }
  }

  async #prepareCandidates() {
    const run = ++this.#prepareRun;
    const candidates = await prepareStoryCandidates(this.components);
    if (run !== this.#prepareRun) {
      return;
    }

    this.#candidates = candidates;
    this.#recomputeMatches();
  }

  #recomputeMatches() {
    if (this.groups.length === 0 || !this.theme) {
      this.storyMatches = [];
    } else {
      this.storyMatches = findMatchingStories(this.groups, this.theme.tokens, this.#candidates);
    }

    this.hidden = this.storyMatches.length === 0;
  }

  override render() {
    if (this.storyMatches.length === 0) {
      return nothing;
    }

    return html`
      ${this.storyMatches.map(({ id, meta, story }) => {
        // `DataBadgeColor` → `Data Badge Color`
        const storyTitle = id.replace(/([A-Z])/g, ' $1').trim();
        return html`
          <wizard-story-section
            heading=${storyTitle}
            .story=${story}
            .componentMeta=${meta}
            .args=${story.args ?? {}}
          ></wizard-story-section>
        `;
      })}
    `;
  }
}
