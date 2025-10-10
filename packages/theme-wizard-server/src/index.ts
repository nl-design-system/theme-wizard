import type { OpenAPIV3_1 } from 'openapi-types';
import type { BaseSchema, BaseIssue } from 'valibot';
import { getCss as getCssOrigins, ScrapingError } from '@nl-design-system-community/css-scraper';
import { css_to_tokens as cssToTokens } from '@projectwallace/css-design-tokens';
import { Hono } from 'hono';
import { describeRoute, openAPIRouteHandler, validator } from 'hono-openapi';
import { cors } from 'hono/cors';
import { timing, startTime, endTime } from 'hono/timing';
import * as v from 'valibot';
import { urlSchema } from './middleware/url-required';

type ErrorResponse = {
  error: {
    name: string;
    message: string;
  };
  issues?: Array<
    | {
        message: string;
        name: string;
      }
    | {
        message: string;
        path?: string;
      }
  >;
};

type ValidationTarget = 'query' | 'json' | 'param' | 'header' | 'cookie';

const cssDesignTokenExtensionsType = {
  properties: {
    'com.projectwallace.css-authored-as': { type: 'string' as const },
    'com.projectwallace.usage-count': { type: 'number' as const },
  },
  type: 'object' as const,
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokensColorType = {
  properties: {
    $extensions: {
      ...cssDesignTokenExtensionsType,
      properties: {
        ...cssDesignTokenExtensionsType.properties,
        'com.projectwallace.css-properties': {
          items: {
            type: 'string',
          },
          type: 'array',
        },
      },
    },
    $type: { enum: ['color'], type: 'string' },
    $value: {
      properties: {
        alpha: { type: 'number' },
        colorSpace: { type: 'string' },
        components: {
          items: { type: 'number' },
          type: 'array',
        },
      },
      type: 'object',
    },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokensFontFamilyType = {
  properties: {
    $extensions: cssDesignTokenExtensionsType,
    $type: { enum: ['fontFamily'], type: 'string' },
    $value: {
      items: { type: 'string' },
      type: 'array',
    },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenPlainType = {
  properties: {
    $extensions: cssDesignTokenExtensionsType,
    $value: { type: 'string' },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenDimensionType = {
  properties: {
    $extensions: cssDesignTokenExtensionsType,
    $type: { enum: ['dimension'], type: 'string' },
    $value: {
      properties: {
        unit: { enum: ['px', 'rem'], type: 'string' },
        value: { type: 'number' },
      },
      type: 'object',
    },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenNumberType = {
  properties: {
    $extensions: cssDesignTokenExtensionsType,
    $type: { enum: ['number'], type: 'string' },
    $value: { type: 'number' },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenDurationType = {
  properties: {
    $extensions: cssDesignTokenExtensionsType,
    $type: { enum: ['duration'], type: 'string' },
    $value: {
      properties: {
        unit: { enum: ['ms'], type: 'string' },
        value: { type: 'number' },
      },
      type: 'object',
    },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenCssLengthType = {
  properties: {
    unit: { type: 'string' },
    value: { type: 'number' },
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenShadowType = {
  properties: {
    blur: cssDesignTokenCssLengthType,
    color: cssDesignTokensColorType.properties.$value,
    inset: { type: 'boolean' },
    offsetX: cssDesignTokenCssLengthType,
    offsetY: cssDesignTokenCssLengthType,
    spread: cssDesignTokenCssLengthType,
  },
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenBoxShadowType = {
  oneOf: [
    cssDesignTokenShadowType,
    {
      items: cssDesignTokenShadowType,
      type: 'array',
    },
  ],
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokenEasingType = {
  oneOf: [
    cssDesignTokenShadowType,
    {
      items: cssDesignTokenShadowType,
      type: 'array',
    },
  ],
  type: 'object',
} satisfies OpenAPIV3_1.NonArraySchemaObject;

const cssDesignTokensResponseType = {
  properties: {
    box_shadow: {
      additionalProperties: {
        oneOf: [cssDesignTokenPlainType, cssDesignTokenBoxShadowType],
        type: 'object',
      },
      type: 'object',
    },
    color: {
      additionalProperties: cssDesignTokensColorType,
      type: 'object',
    },
    duration: {
      additionalProperties: {
        oneOf: [cssDesignTokenDurationType, cssDesignTokenPlainType],
        type: 'object',
      },
      type: 'object',
    },
    easing: {
      additionalProperties: {
        oneOf: [cssDesignTokenEasingType, cssDesignTokenPlainType],
      },
      type: 'object',
    },
    font_family: {
      additionalProperties: cssDesignTokensFontFamilyType,
      type: 'object',
    },
    font_size: {
      additionalProperties: {
        oneOf: [cssDesignTokenDimensionType, cssDesignTokenPlainType],
        type: 'object',
      },
      type: 'object',
    },
    gradient: {
      additionalProperties: cssDesignTokenPlainType,
      type: 'object',
    },
    line_height: {
      additionalProperties: {
        oneOf: [cssDesignTokenDimensionType, cssDesignTokenNumberType, cssDesignTokenPlainType],
        type: 'object',
      },
      type: 'object',
    },
    radius: {
      additionalProperties: cssDesignTokenPlainType,
      type: 'object',
    },
  },
  type: 'object',
} satisfies OpenAPIV3_1.SchemaObject;

/**
 * @description Custom validator function that turn validation-library specific responses into a generic response
 */
const customValidator = <T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  target: ValidationTarget,
  schema: T,
) => {
  return validator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json<ErrorResponse>(
        {
          error: {
            name: 'Validation error',
            message: 'Validation failed for one or more parameters',
          },
          issues: result.error.map((issue) => ({
            message: issue.message,
            path: issue.path?.map((p) => (typeof p === 'object' ? p.key : String(p))).join('.'),
          })),
        },
        400,
      );
    }
    return undefined;
  });
};

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*', // TODO: scope down
  }),
);

// TODO: add security headers
// See https://hono.dev/docs/middleware/builtin/secure-headers

const errorReturnType = {
  properties: {
    error: {
      properties: {
        name: { type: 'string' },
        message: { type: 'string' },
      },
      type: 'object',
    },
    issues: {
      items: {
        properties: {
          name: { type: 'string' },
          message: { type: 'string' },
          path: { type: 'string' },
        },
        required: ['name', 'message'] as string[],
        type: 'object',
      },
      type: 'array',
    },
  },
  type: 'object',
} as const;

app.get(
  '/healthz',
  describeRoute({
    description: 'Health check',
    responses: {
      200: {
        content: {
          'application/json': { schema: { type: 'object' } },
        },
        description: 'Server is responsive',
      },
      500: {
        content: {
          'text/plain/json': {
            schema: { type: 'string' },
          },
        },
        description: 'Something is wrong',
      },
    },
  }),
  (c) => c.json({}),
);

app.use('/api/v1/*', timing({ autoEnd: true, total: false }));

app.get(
  '/api/v1/css',
  describeRoute({
    description: 'Scrape all CSS from a URL',
    responses: {
      200: {
        content: { 'text/css': { schema: { type: 'string' } } },
        description: 'Scraping successful',
      },
      400: {
        content: { 'application/json': { schema: errorReturnType } },
        description: 'Scraping failed: user error',
      },
      500: {
        content: { 'application/json': { schema: errorReturnType } },
        description: 'Scraping failed: unexpected error',
      },
    },
  }),
  customValidator('query', v.object({ url: urlSchema })),
  async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const origins = await getCssOrigins(url);
    endTime(c, 'scraping');

    const css = origins.map((origin) => origin.css).join('');
    c.res.headers.set('content-type', 'text/css; charset=utf-8');
    return c.body(css);
  },
);

app.get(
  '/api/v1/css-design-tokens',
  describeRoute({
    description: 'Scrape all CSS from a URL',
    responses: {
      200: {
        content: { 'application/json': { schema: cssDesignTokensResponseType } },
        description: 'Scraping successful',
      },
      400: {
        content: { 'application/json': { schema: errorReturnType } },
        description: 'Scraping failed: user error',
      },
      500: {
        content: { 'application/json': { schema: errorReturnType } },
        description: 'Scraping failed: unexpected error',
      },
    },
  }),
  customValidator('query', v.object({ url: urlSchema })),
  async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const origins = await getCssOrigins(url);
    endTime(c, 'scraping');

    const css = origins.map((origin) => origin.css).join('');
    const tokens = cssToTokens(css);
    return c.json(tokens);
  },
);

app.onError((error, c) => {
  return c.json<ErrorResponse>(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    error instanceof ScrapingError ? 400 : 500,
  );
});

app.get(
  'api/v1/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        description: 'NL Design System CSS Scraper API',
        title: 'CSS Scraper',
        version: '0.1.0', // TODO: make version reflect actual package version
      },
    },
  }),
);

export default app;
