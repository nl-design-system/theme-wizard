import type { Handler, Context, Env, Next } from 'hono';
import { ScrapingError } from '@nl-design-system-community/css-scraper';
import { HTTPException } from 'hono/http-exception';

export const withScrapingErrorHandler = <E extends Env = Env, P extends string = string>(
  handler: Handler<E, P>,
): Handler<E, P> => {
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
