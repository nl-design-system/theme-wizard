import { getCss } from '@nl-design-system-community/css-scraper';
import { Hono } from 'hono';
import { describeRoute, resolver, validator, openAPIRouteHandler } from 'hono-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import * as v from 'valibot';

const getCssQuerySchema = v.object({
  url: v.pipe(v.string(), v.nonEmpty('Please specify a URL to scrape')),
});

const getCssResponseSchema = v.string();

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

app.get(
  '/v1/api/get-css',
  describeRoute({
    description: 'Scrape all CSS from a URL',
    responses: {
      200: {
        content: {
          'text/css': { schema: resolver(getCssResponseSchema) },
        },
        description: 'Scraping successful',
      },
      400: {
        content: {
          'text/plain': { schema: resolver(getCssResponseSchema) },
        },
        description: 'Scraping failed: user error',
      },
      500: {
        content: {
          'text/plain': { schema: resolver(getCssResponseSchema) },
        },
        description: 'Scraping failed: unexpected error',
      },
    },
  }),
  validator('query', getCssQuerySchema),
  async (c) => {
    const url = c.req.query('url')!;

    try {
      const startTime = Date.now();
      const origins = await getCss(url);
      const css = origins.map((origin) => origin.css).join('');
      const endTime = Date.now();

      c.res.headers.set('server-timing', `scraping;desc="Scraping CSS";dur=${endTime - startTime}`);
      c.res.headers.set('content-type', 'text/css; charset=utf-8');
      return c.body(css);
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error) {
        throw new HTTPException(400, {
          cause: error,
          message: error.message,
        });
      }

      throw new HTTPException(500, { cause: error, message: 'encountered a scraping error' });
    }
  },
);

app.get(
  '/v1/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        description: 'NL Design System CSS Scraper API',
        title: 'CSS Scraper',
        version: '1.0.0',
      },
    },
  }),
);

export default app;
