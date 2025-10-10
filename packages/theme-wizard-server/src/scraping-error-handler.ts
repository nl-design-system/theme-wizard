import type { MiddlewareHandler, Context, Next } from 'hono';
import { ScrapingError } from '@nl-design-system-community/css-scraper';
import { HTTPException } from 'hono/http-exception';

export const withScrapingErrorHandler = (handler: MiddlewareHandler): MiddlewareHandler => {
  return async (c: Context, next: Next) => {
    try {
      return await handler(c, next);
    } catch (error) {
      if (error instanceof ScrapingError) {
        throw new HTTPException(400, {
          cause: error,
          message: error.message,
        });
      }
      throw new HTTPException(500, {
        cause: error,
        message: 'encountered a scraping error',
      });
    }
  };
};
