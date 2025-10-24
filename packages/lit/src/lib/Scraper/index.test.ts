import { describe, expect, test, vi } from 'vitest';
import Scraper from './index';

describe('Scraper', () => {
  const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(async () => {
    return new Response('', { status: 200 });
  });

  test('tries to fetch css for given url', () => {
    const scraperURL = 'https://example.com/';
    const targetURL = 'https://example.com/target';
    const scraper = new Scraper(scraperURL);

    scraper.getCSS(new URL(targetURL));

    expect(fetchSpy).toBeCalledWith(new URL(`${scraperURL}api/v1/css?url=${encodeURIComponent(targetURL)}`));
  });

  test('can be invoked multiple times', () => {
    const scraperURL = 'https://example.com/';
    const targetURL = 'https://example.com/test';
    const scraper = new Scraper(scraperURL);

    scraper.getCSS(new URL(targetURL));
    scraper.getCSS(new URL(targetURL));

    expect(fetchSpy).toBeCalledWith(new URL(`${scraperURL}api/v1/css?url=${encodeURIComponent(targetURL)}`));
  });
});
