import type { Handler, Context, Env, Next } from 'hono';
import { ScrapingError } from '@nl-design-system-community/css-scraper';
import type { ClientError } from './schemas/client-error';
import type { ServerError } from './schemas/server-error';

export const withScrapingErrorHandler = <E extends Env = Env, P extends string = string>(
  handler: Handler<E, P>,
): Handler<E, P> => {
  return async (c: Context, next: Next) => {
    try {
      return await handler(c, next);
    } catch (error) {
      if (error instanceof ScrapingError) {
        return c.json<ClientError>(
          {
            errors: [
              {
                name: error.name,
                message: error.message,
              },
            ],
            ok: false,
          },
          400,
        );
      }

      return c.json<ServerError>(
        {
          error: {
            message: 'encountered a scraping error',
          },
          ok: false,
        },
        500,
      );
    }
  };
};
