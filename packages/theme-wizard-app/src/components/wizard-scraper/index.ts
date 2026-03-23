import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import formFieldStyles from '@utrecht/form-field-css?inline';
import formFieldErrorCss from '@utrecht/form-field-error-message-css?inline';
import formLabelStyles from '@utrecht/form-label-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createActor, type Actor, type SnapshotFrom } from 'xstate';
import { t } from '../../i18n';
import Scraper from '../../lib/Scraper';
import { scraperMachine, type ScraperMachine } from './state-machine';
import styles from './styles';

const tag = 'wizard-scraper';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScraper;
  }
}

@customElement(tag)
export class WizardScraper extends LitElement {
  static override readonly styles = [
    unsafeCSS(formFieldStyles),
    unsafeCSS(formLabelStyles),
    unsafeCSS(textboxStyles),
    unsafeCSS(paragraphStyles),
    unsafeCSS(linkStyles),
    unsafeCSS(formFieldErrorCss),
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
      this._snapshot = snapshot;

      // Let the host app know that we're done so it can start navigating
      if (snapshot.matches('done')) {
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

    this.#actor?.send({ type: 'SUBMIT', url: typeof urlValue === 'string' ? urlValue : '' });
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
    const isError = snapshot.matches('error');

    const submittedUrl = snapshot.context.url;
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
            <wizard-stack size="xl">
              <wizard-story-preview size="lg">
                <wizard-stack size="3xl">
                  <clippy-heading level="2">${t('scraper.title')}</clippy-heading>
                  <p class="nl-paragraph nl-paragraph--lead">${t('scraper.intro')}</p>
                  <form @submit=${this.#handleSubmit}>
                    <wizard-stack size="3xl">
                      <div
                        class="utrecht-form-field utrecht-form-field--text ${classMap({
                          'utrecht-form-field--invalid': isError,
                        })}"
                      >
                        <div class="utrecht-form-field__label">
                          <label for="scraper-url" class="utrecht-form-label">${t('scraper.input.label')}</label>
                        </div>
                        <div class="utrecht-form-field__description">${t('scraper.input.description')}</div>
                        ${errorMessage}
                        <div class="utrecht-form-field__input">
                          <input
                            aria-errormessage=${ariaErrorMessage}
                            aria-invalid=${ariaInvalid}
                            class="utrecht-textbox utrecht-textbox--html-input"
                            id="scraper-url"
                            inputmode="url"
                            name="url"
                            type="text"
                            value=${submittedUrl ?? ''}
                          />
                        </div>
                      </div>

                      <utrecht-button appearance="primary-action-button" type="submit">
                        ${t('scraper.submit')}
                      </utrecht-button>
                    </wizard-stack>
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
                text=${t('scraper.loaders.loader1.text', { url: submittedUrl })}
              ></wizard-scraper-loader>
              <wizard-scraper-loader
                aria-hidden=${loader2AriaHidden}
                class=${classMap({ 'wizard-scraper__loader--active': this.#timerState === 'loader2' })}
                emoji="🎨"
                heading=${t('scraper.loaders.loader2.heading')}
                text=${t('scraper.loaders.loader2.text', { url: submittedUrl })}
              ></wizard-scraper-loader>
            </div>
          `
        : nothing}
    `;
  }
}
