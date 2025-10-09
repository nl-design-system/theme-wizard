import { getCss as getCssOrigins } from '@nl-design-system-community/css-scraper';
import { type Context, type Next, Hono, MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

const app = new Hono();
app.use(
  '*',
  cors({
    // TODO: scope down
    origin: '*',
  }),
);

app.get('/healthz', (c) => {
  return c.json({});
});

export const requireUrlParam = async (c: Context, next: Next) => {
  const url = c.req.query('url');

  if (!url || url.trim().length === 0) {
    throw new HTTPException(400, {
      message: 'missing `url` parameter: specify a url like ?url=example.com',
    });
  }

  await next();
};

export const withScrapingErrorHandler = (handler: MiddlewareHandler): MiddlewareHandler => {
  return async (c: Context, next: Next) => {
    try {
      return await handler(c, next);
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
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

app.get(
  '/api/v1/css',
  requireUrlParam,
  withScrapingErrorHandler(async (c) => {
    const url = c.req.query('url')!;
    const startTime = Date.now();
    const origins = await getCssOrigins(url);
    const css = origins.map((origin) => origin.css).join('');
    const endTime = Date.now();

    c.res.headers.set('server-timing', `scraping;desc="Scraping CSS";dur=${endTime - startTime}`);
    c.res.headers.set('content-type', 'text/css; charset=utf-8');
    return c.body(css);
  }),
);

export default app;
