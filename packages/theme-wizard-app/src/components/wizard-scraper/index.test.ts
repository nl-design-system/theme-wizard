import './index';
import { getByLabelText, getByRole, getByTestId } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WizardScraper } from './index';

// @testing-library/dom expects HTMLElement but ShadowRoot is a valid query root.
const shadow = (el: WizardScraper): HTMLElement => el.shadowRoot?.firstElementChild as HTMLElement;

const tag = 'wizard-scraper';
const SCRAPER_URL = 'http://localhost:3000/';

const createTestElement = async (): Promise<WizardScraper> => {
  const el = document.createElement(tag) as WizardScraper;
  el.scraperUrl = SCRAPER_URL;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

const submitUrl = async (el: WizardScraper, url: string) => {
  const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' }) as HTMLInputElement;
  input.value = url;
  const form = el.shadowRoot!.querySelector('form')!;
  form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
  await el.updateComplete;
};

// Flush pending XState actor promises and allow Lit to re-render.
// Multiple ticks are needed because the error path has several sequential awaits:
// fetch() → response.json() → XState onError handler → Lit state update.
// Each await yields to the microtask queue once, so we need enough ticks to
// let all of them settle before asserting on the rendered output.
const flushAsync = async (el: WizardScraper) => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
  await el.updateComplete;
};

const mockFetchError = (errorName: string) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ errors: [{ name: errorName }] }),
        ok: false,
      }),
    ),
  );
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('initial state', () => {
    it('renders the URL input form', async () => {
      const el = await createTestElement();
      expect(el.shadowRoot!.querySelector('form')).toBeTruthy();
    });

    it('renders the URL input field', async () => {
      const el = await createTestElement();
      expect(getByLabelText(shadow(el), 'Website URL')).toBeTruthy();
    });

    it('does not show loaders', async () => {
      const el = await createTestElement();
      expect(el.querySelector('wizard-scraper-loader')).toBeNull();
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      // Fetch never resolves so the component stays in loading state
      vi.stubGlobal(
        'fetch',
        vi.fn(() => new Promise(() => {})),
      );
    });

    it('shows the loaders when a valid URL is submitted', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      expect(el.shadowRoot!.querySelector('wizard-scraper-loader')).toBeTruthy();
    });

    it('hides the form when loading', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      expect(el.shadowRoot!.querySelector('form')).toBeNull();
    });
  });

  describe('error state — invalid URL', () => {
    it('shows an error message for an invalid URL', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'not-a-url');
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAccessibleErrorMessage('Vul een valide URL in');
    });

    it('marks the input as aria-invalid', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'not-a-url');
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-errormessage on the input pointing to the error element', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'not-a-url');
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAttribute('aria-errormessage', 'scraper-error');
    });

    it('still shows the form so the user can correct the URL', async () => {
      const el = await createTestElement();
      await submitUrl(el, 'not-a-url');
      expect(el.shadowRoot!.querySelector('form')).toBeTruthy();
    });
  });

  describe('error state — scraper errors', () => {
    it.each([
      { errorName: 'NotFoundError', expectedMessage: 'Deze pagina kan niet worden gevonden.' },
      { errorName: 'ConnectionRefusedError', expectedMessage: 'Deze website lijkt niet te bestaan.' },
      { errorName: 'ForbiddenError', expectedMessage: 'Deze website staat niet toe om geanalyseerd te worden.' },
      { errorName: 'TimeoutError', expectedMessage: 'Deze website reageert te langzaam om te kunnen analyseren' },
    ])('shows the correct message for $errorName', async ({ errorName, expectedMessage }) => {
      mockFetchError(errorName);
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      await flushAsync(el);
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAccessibleErrorMessage(expectedMessage);
    });

    it('shows a generic error for an unrecognised error name', async () => {
      mockFetchError('UnknownError');
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      await flushAsync(el);
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAccessibleErrorMessage('Kan deze website niet analyseren');
    });

    it('shows a generic error when the response body has no errors array', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({}),
            ok: false,
          }),
        ),
      );
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      await flushAsync(el);
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAccessibleErrorMessage('Kan deze website niet analyseren');
    });

    it('shows a generic error when the request fails on a non-HTTP error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => {
          throw new Error('Whoopsie');
        }),
      );
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      await flushAsync(el);
      const input = getByRole(shadow(el), 'textbox', { name: 'Website URL' });
      expect(input).toHaveAccessibleErrorMessage('Kan deze website niet analyseren');
    });

    it('shows the form again so the user can retry', async () => {
      mockFetchError('NotFoundError');
      const el = await createTestElement();
      await submitUrl(el, 'https://example.com');
      await flushAsync(el);
      expect(el.shadowRoot!.querySelector('form')).toBeTruthy();
    });
  });

  describe('success state', () => {
    const mockTokens = [{ name: '--color-primary', value: '#000000' }];

    beforeEach(() => {
      vi.useFakeTimers();
      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve(mockTokens),
            ok: true,
          }),
        ),
      );
    });

    it('dispatches a wizard-scraper-done event when scraping completes', async () => {
      const el = await createTestElement();
      const handler = vi.fn();
      el.addEventListener('wizard-scraper-done', handler);

      await submitUrl(el, 'https://example.com');
      // Advance past both loader stages (3s + 3s) and flush in-flight promises
      await vi.advanceTimersByTimeAsync(6000);
      await el.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
    });

    it('includes the scraped tokens in the event detail', async () => {
      const el = await createTestElement();
      const handler = vi.fn();
      el.addEventListener('wizard-scraper-done', handler);

      await submitUrl(el, 'https://example.com');
      await vi.advanceTimersByTimeAsync(6000);
      await el.updateComplete;

      expect(handler.mock.calls[0][0].detail.result).toEqual(mockTokens);
    });
  });
});
