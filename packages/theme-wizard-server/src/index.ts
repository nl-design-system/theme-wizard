import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getCss, getDesignTokens } from '@nl-design-system-community/css-scraper';
import { cors } from 'hono/cors';
import { timing, startTime, endTime } from 'hono/timing';
import pkg from '../package.json';
import { clientErrorSchema } from './schemas/client-error';
import { DesignToken } from './schemas/design-tokens';
import { serverErrorSchema } from './schemas/server-error';
import { withScrapingErrorHandler } from './scraping-error-handler';

// This is necessary to trick Vercel into deploying this as a HonoJS app
/* @__PURE__ */ import('hono');

const urlSchema = z.string().nonempty().openapi({
  example: 'example.com',
  type: 'string',
});

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (result.success) return undefined;

    return c.json(
      {
        errors: result.error.issues.map((issue) => ({
          name: issue.code,
          message: issue.message,
          path: issue.path.join('.'),
        })),
        ok: false,
      },
      400,
    );
  },
});

app.use(
  '*',
  cors({
    origin: '*', // TODO: scope down
  }),
);

app.get('/', (c) => c.redirect('/api/v1/openapi.json'));

// TODO: add security headers
// See https://hono.dev/docs/middleware/builtin/secure-headers

app.openapi(
  createRoute({
    description: 'Health check',
    method: 'get',
    path: '/healthz',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.strictObject({}).openapi({
              example: {},
              type: 'object',
            }),
          },
        },
        description: 'Server is responsive',
      },
    },
  }),
  (c) => c.json({}),
);

app.use('/api/v1/*', timing({ autoEnd: true, total: false }));

app.openapi(
  createRoute({
    description: 'Scrape all CSS from a URL',
    method: 'get',
    path: '/api/v1/css',
    request: {
      query: z.object({
        url: urlSchema,
      }),
    },
    responses: {
      200: {
        content: {
          'text/css': {
            schema: z.string().openapi({
              example: 'body { font-size: 1rem; }',
              type: 'string',
            }),
          },
        },
        description: 'Scraping successful',
      },
      400: {
        content: { 'application/json': { schema: clientErrorSchema } },
        description: 'Scraping failed: user error',
      },
      500: {
        content: { 'application/json': { schema: serverErrorSchema } },
        description: 'Scraping failed: unexpected error',
      },
    },
  }),
  async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const css = await getCss(url);
    endTime(c, 'scraping');

    c.res.headers.set('content-type', 'text/css; charset=utf-8');
    return c.body(css);
  },
);

app.openapi(
  createRoute({
    description: 'Scrape all CSS from a URL',
    method: 'get',
    path: '/api/v1/css-design-tokens',
    request: {
      query: z.object({
        url: urlSchema,
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(DesignToken).openapi({
              type: 'array',
            }),
          },
        },
        description: 'Scraping successful',
      },
      400: {
        content: { 'application/json': { schema: clientErrorSchema } },
        description: 'Scraping failed: user error',
      },
      500: {
        content: { 'application/json': { schema: serverErrorSchema } },
        description: 'Scraping failed: unexpected error',
      },
    },
  }),
  withScrapingErrorHandler(async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const css = await getCss(url);
    const tokens = getDesignTokens(css);
    endTime(c, 'scraping');

    return c.json(tokens);
  }),
);

app.doc31('api/v1/openapi.json', {
  info: {
    description: 'NL Design System CSS Scraper API',
    title: 'CSS Scraper',
    version: pkg.version,
  },
  openapi: '3.1.0',
});

export default app;
