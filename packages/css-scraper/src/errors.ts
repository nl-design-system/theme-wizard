import { isLocalhostUrl } from './is-localhost';

export type UrlLike = URL | string;

export class ScrapingError extends Error {
  // @ts-expect-error This is a private, unused field
  private url: UrlLike;

  constructor(message: string, url: UrlLike) {
    super(message);
    this.url = url;
    this.name = 'ScrapingError';
  }
}

export class ForbiddenError extends ScrapingError {
  constructor(url: UrlLike) {
    super(
      'The origin server responded with a 403 Forbidden status code which means that scraping CSS is blocked. Is the URL publicly accessible?',
      url,
    );
    this.name = 'ForbiddenError';
  }
}

export class ConnectionRefusedError extends ScrapingError {
  constructor(url: UrlLike) {
    let message = 'The origin server is refusing connections.';
    if (isLocalhostUrl(url)) {
      message += ' You are trying to scrape a local server. Make sure to use a public URL.';
    }
    super(message, url);
    this.name = 'ConnectionRefusedError';
  }
}

export class NotFoundError extends ScrapingError {
  constructor(url: UrlLike) {
    super('The origin server responded with a 404 Not Found status code.', url);
    this.name = 'NotFoundError';
  }
}

export class InvalidUrlError extends ScrapingError {
  constructor(url: UrlLike) {
    super('The URL is not valid. Are you sure you entered a URL and not CSS?', url);
    this.name = 'InvalidUrlError';
  }
}

export class TimeoutError extends ScrapingError {
  constructor(url: UrlLike, timeout: number) {
    super(`Request timed out after ${timeout}ms`, url);
    this.name = 'TimeoutError';
  }
}
