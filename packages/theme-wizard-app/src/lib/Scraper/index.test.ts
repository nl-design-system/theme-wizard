import { describe, expect, it, vi } from 'vitest';
import Scraper from './index';

describe('Scraper', () => {
  const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(async function () {
    return new Response('', { status: 200 });
  });

  it('tries to fetch css for given url', () => {
    const scraperURL = 'https://example.com/';
    const targetURL = 'https://example.com/target';
    const scraper = new Scraper(scraperURL);

    scraper.getCSS(new URL(targetURL));

    expect(fetchSpy).toBeCalledWith(new URL(`${scraperURL}api/v1/css?url=${encodeURIComponent(targetURL)}`));
  });

  it('can be invoked multiple times', () => {
    const scraperURL = 'https://example.com/';
    const targetURL = 'https://example.com/test';
    const scraper = new Scraper(scraperURL);

    scraper.getCSS(new URL(targetURL));
    scraper.getCSS(new URL(targetURL));

    expect(fetchSpy).toBeCalledWith(new URL(`${scraperURL}api/v1/css?url=${encodeURIComponent(targetURL)}`));
  });
});
