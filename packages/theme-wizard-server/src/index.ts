import { swaggerUI } from '@hono/swagger-ui';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import {
  getCss,
  getDesignTokens,
  DesignTokenSchema,
  type DesignToken,
  EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/css-scraper';
import { withRelatedProject } from '@vercel/related-projects';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { timing, startTime, endTime } from 'hono/timing';
import pkg from '../package.json';
import { clientErrorSchema } from './schemas/client-error';
import { type ServerError, serverErrorSchema } from './schemas/server-error';
import { withScrapingErrorHandler } from './scraping-error-handler';

// This tricks Vercel into deploying this as a HonoJS app
/* @__PURE__ */ import('hono');

const urlSchema = z.string().trim().openapi({
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

const websiteHost = withRelatedProject({
  defaultHost: 'http://localhost:9492',
  projectName: 'theme-wizard',
});

app.use(
  '*',
  cors({
    allowMethods: ['HEAD', 'GET'],
    origin: (requestOrigin) => {
      console.debug({ requestOrigin, websiteHost });
      if (requestOrigin === websiteHost) return requestOrigin;
      return null;
    },
  }),
);

app.use('*', secureHeaders());

app.get('/', (c) => c.redirect('/api/v1/openapi.json'));

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
        description: 'Scraping css successful',
      },
      400: {
        content: { 'application/json': { schema: clientErrorSchema } },
        description: 'Scraping css failed: user error',
      },
      500: {
        content: { 'application/json': { schema: serverErrorSchema } },
        description: 'Scraping css failed: unexpected error',
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
            schema: z.array(DesignTokenSchema).openapi({
              example: [
                {
                  $extensions: {
                    [EXTENSION_AUTHORED_AS]: 'Arial, sans-serif',
                    [EXTENSION_CSS_PROPERTIES]: ['font-family'],
                    [EXTENSION_TOKEN_ID]: 'fontFamily-abc123',
                    [EXTENSION_USAGE_COUNT]: 12,
                  },
                  $type: 'fontFamily',
                  $value: ['Arial', 'sans-serif'],
                },
                {
                  $extensions: {
                    [EXTENSION_AUTHORED_AS]: '16px',
                    [EXTENSION_CSS_PROPERTIES]: ['font-size'],
                    [EXTENSION_TOKEN_ID]: 'fontSize-abc123',
                    [EXTENSION_USAGE_COUNT]: 3,
                  },
                  $type: 'dimension',
                  $value: {
                    unit: 'px',
                    value: 16,
                  },
                },
              ] satisfies DesignToken[],
              type: 'array',
            }),
          },
        },
        description: 'Scraping design tokens successful',
      },
      400: {
        content: { 'application/json': { schema: clientErrorSchema } },
        description: 'Scraping design tokens failed: user error',
      },
      500: {
        content: { 'application/json': { schema: serverErrorSchema } },
        description: 'Scraping design tokens failed: unexpected error',
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

app.get(
  '/api/docs',
  swaggerUI({
    url: '/api/v1/openapi.json',
  }),
);

// // Make all error responses uniform: all respond with the correct schema
app.onError((error, c) => {
  return c.json<ServerError>(
    {
      error: {
        message: 'Internal server error',
      },
      ok: false,
    },
    500,
  );
});

export default app;
