import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { resolveUrl } from '@nl-design-system-community/css-scraper';
import formFieldStyles from '@utrecht/form-field-css?inline';
import formLabelStyles from '@utrecht/form-label-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, nothing, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { assign, createActor, fromPromise, raise, setup, type Actor, type SnapshotFrom } from 'xstate';
import { t } from '../../i18n';
import Scraper from '../../lib/Scraper';
import styles from './styles';

const tag = 'wizard-scraper';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScraper;
  }
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const scraperMachine = setup({
  actors: {
    scrapeTokens: fromPromise<ScrapedDesignToken[], { scraper: Scraper; url: URL }>(({ input }) =>
      input.scraper.getTokens(input.url),
    ),
  },
  types: {
    context: {} as {
      error: string | TemplateResult;
      result: ScrapedDesignToken[];
      scraper: Scraper;
      url: URL | null;
    },
    events: {} as { type: 'SUBMIT'; url: URL } | { type: 'TASK_RESOLVED' } | { type: 'VALIDATION_FAILED' },
    input: {} as { scraper: Scraper },
  },
}).createMachine({
  id: 'scraper-form',
  context: ({ input }) => ({
    error: '',
    result: [],
    scraper: input.scraper,
    url: null,
  }),
  initial: 'idle',

  states: {
    done: {},

    error: {
      on: {
        SUBMIT: {
          actions: assign({ url: ({ event }) => event.url }),
          target: 'loading',
        },
        VALIDATION_FAILED: {
          actions: assign({ error: () => t('scraper.invalidUrl') }),
        },
      },
    },

    idle: {
      on: {
        SUBMIT: {
          actions: assign({ url: ({ event }) => event.url }),
          target: 'loading',
        },
        VALIDATION_FAILED: {
          actions: assign({ error: () => t('scraper.invalidUrl') }),
          target: 'error',
        },
      },
    },

    loading: {
      invoke: {
        // url is guaranteed non-null here: SUBMIT always sets it before entering loading.
        input: ({ context }) => ({ scraper: context.scraper, url: context.url as URL }), // NOSONAR
        onDone: {
          // No target — stay in the parallel regions; just record the result
          // and raise an internal event so the `task` region can finalize.
          actions: [assign({ result: ({ event }) => event.output }), raise({ type: 'TASK_RESOLVED' })],
        },
        onError: {
          // Exit immediately regardless of where the timer is.
          actions: assign({ error: ({ context }) => t('scraper.scrapeFailed', { url: context.url }) }),
          target: 'error',
        },
        src: 'scrapeTokens',
      },

      // Fires when task.resolved AND timer.timerDone are both reached.
      onDone: 'done',

      // Both regions must reach their final state before `loading.onDone`
      // fires — this enforces the minimum 3 + 3 = 6 second display time
      // while also waiting for slow async tasks.
      states: {
        // Tracks async task completion.
        task: {
          initial: 'pending',
          states: {
            pending: {
              on: { TASK_RESOLVED: 'resolved' },
            },
            resolved: { type: 'final' },
          },
        },

        // Drives the visual loading steps.
        timer: {
          initial: 'loader1',
          states: {
            loader1: { after: { 3000: 'loader2' } },
            loader2: { after: { 3000: 'timerDone' } },
            timerDone: { type: 'final' },
          },
        },
      },

      type: 'parallel',
    },
  },
});

type ScraperMachine = typeof scraperMachine;

// ---------------------------------------------------------------------------
// Web component
// ---------------------------------------------------------------------------

@customElement(tag)
export class WizardScraper extends LitElement {
  static override readonly styles = [
    unsafeCSS(formFieldStyles),
    unsafeCSS(formLabelStyles),
    unsafeCSS(textboxStyles),
    unsafeCSS(paragraphStyles),
    unsafeCSS(linkStyles),
    styles,
  ];

  @property() scraperUrl?: string;

  #actor?: Actor<ScraperMachine>;

  @state() private _snapshot?: SnapshotFrom<ScraperMachine>;

  override connectedCallback() {
    super.connectedCallback();

    const scraper = new Scraper(this.scraperUrl);
    this.#actor = createActor(scraperMachine, { input: { scraper } });
    this.#actor.subscribe((snapshot) => {
      const prev = this._snapshot;
      this._snapshot = snapshot;

      if (snapshot.matches('loading') && !prev?.matches('loading')) {
        this.dispatchEvent(new CustomEvent('wizard-scraper-loading', { bubbles: true, composed: true }));
      } else if (snapshot.matches('error') && !prev?.matches('error')) {
        this.dispatchEvent(
          new CustomEvent('wizard-scraper-error', {
            bubbles: true,
            composed: true,
            detail: { error: snapshot.context.error },
          }),
        );
      } else if (snapshot.matches('done') && !prev?.matches('done')) {
        this.dispatchEvent(
          new CustomEvent('wizard-scraper-done', {
            bubbles: true,
            composed: true,
            detail: { result: snapshot.context.result },
          }),
        );
      }
    });
    this.#actor.start();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#actor?.stop();
  }

  readonly #handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const formData = new FormData(form);
    const urlValue = formData.get('url');
    const urlLike = resolveUrl(typeof urlValue === 'string' ? urlValue : '');

    if (!urlLike) {
      this.#actor?.send({ type: 'VALIDATION_FAILED' });
      return;
    }

    this.#actor?.send({ type: 'SUBMIT', url: urlLike });
  };

  get #timerState() {
    if (!this._snapshot?.matches('loading')) return null;
    const timer = (this._snapshot.value as { loading: { timer: string } }).loading.timer;
    // Keep showing loader2 while waiting for a slow task after the timer is done.
    return timer === 'loader1' ? 'loader1' : 'loader2';
  }

  override render() {
    const snapshot = this._snapshot;
    if (!snapshot) return nothing;

    const isIdle = snapshot.matches('idle');
    const isLoading = snapshot.matches('loading');
    const isDone = snapshot.matches('done');
    const isError = snapshot.matches('error');

    const ariaErrorMessage = isError ? 'scraper-error' : nothing;
    const ariaInvalid = isError ? 'true' : nothing;
    const loader1AriaHidden = this.#timerState === 'loader1' ? nothing : 'true';
    const loader2AriaHidden = this.#timerState === 'loader2' ? nothing : 'true';
    const errorMessage = isError
      ? html`
          <utrecht-form-field-error-message id="scraper-error" class="utrecht-form-field__error-message">
            <p class="nl-paragraph utrecht-form-field-error-message">${snapshot.context.error}</p>
          </utrecht-form-field-error-message>
        `
      : nothing;

    return html`
      ${isIdle || isError
        ? html`
            <wizard-stack>
              <wizard-story-preview size="lg">
                <wizard-stack>
                  <clippy-heading level="2">${t('scraper.title')}</clippy-heading>
                  <form
                    @submit=${this.#handleSubmit}
                    class="utrecht-form-field utrecht-form-field--text ${classMap({
                      'utrecht-form-field--invalid': isError,
                    })}"
                  >
                    <div class="utrecht-form-label">
                      <label for="scraper-url" class="utrecht-form-label">${t('scraper.input.label')}</label>
                    </div>
                    <div class="wizard-scraper-form__input utrecht-form-field__input wizard-scraper__input">
                      <input
                        aria-errormessage=${ariaErrorMessage}
                        aria-invalid=${ariaInvalid}
                        class="utrecht-textbox utrecht-textbox--html-input"
                        id="scraper-url"
                        inputmode="url"
                        name="url"
                        placeholder="gemeentevoorbeeld.nl"
                        type="text"
                        value=${snapshot.context.url?.toString() ?? ''}
                      />
                      <utrecht-button appearance="primary-action-button" type="submit">
                        ${t('scraper.submit')}
                      </utrecht-button>
                    </div>
                    ${errorMessage}
                  </form>
                </wizard-stack>
              </wizard-story-preview>
              <p class="nl-paragraph">${t('scraper.directStart')}</p>
            </wizard-stack>
          `
        : nothing}
      ${isLoading
        ? html`
            <div class="wizard-scraper__loaders">
              <wizard-scraper-loader
                aria-hidden=${loader1AriaHidden}
                class=${classMap({ 'wizard-scraper__loader--active': this.#timerState === 'loader1' })}
                emoji="🧙"
                heading=${t('scraper.loaders.loader1.heading')}
                text=${t('scraper.loaders.loader1.text', { url: this._snapshot?.context.url })}
              ></wizard-scraper-loader>
              <wizard-scraper-loader
                aria-hidden=${loader2AriaHidden}
                class=${classMap({ 'wizard-scraper__loader--active': this.#timerState === 'loader2' })}
                emoji="🎨"
                heading=${t('scraper.loaders.loader2.heading')}
                text=${t('scraper.loaders.loader2.text', { url: this._snapshot?.context.url })}
              ></wizard-scraper-loader>
            </div>
          `
        : nothing}
      ${isDone ? html`<slot name="done"></slot>` : nothing}
    `;
  }
}
