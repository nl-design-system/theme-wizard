import { getCss as getCssOrigins } from '@nl-design-system-community/css-scraper';
import { css_to_tokens as cssToTokens } from '@projectwallace/css-design-tokens';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing, startTime, endTime } from 'hono/timing';
import { requireUrlParam } from './middleware/url-required';
import { withScrapingErrorHandler } from './scraping-error-handler';

const app = new Hono();
app.use(
  '*',
  cors({
    // TODO: scope down
    origin: '*',
  }),
);

// TODO: add security headers
// See https://hono.dev/docs/middleware/builtin/secure-headers

app.get('/healthz', (c) => {
  return c.json({});
});

app.use('/api/v1/*', timing({ autoEnd: true, total: false }));

app.get(
  '/api/v1/css',
  requireUrlParam,
  withScrapingErrorHandler(async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const origins = await getCssOrigins(url);
    endTime(c, 'scraping');

    const css = origins.map((origin) => origin.css).join('');
    c.res.headers.set('content-type', 'text/css; charset=utf-8');
    return c.body(css);
  }),
);

app.get(
  '/api/v1/css-design-tokens',
  requireUrlParam,
  withScrapingErrorHandler(async (c) => {
    const url = c.req.query('url')!;

    startTime(c, 'scraping', 'Scraping CSS');
    const origins = await getCssOrigins(url);
    const css = origins.map((origin) => origin.css).join('');
    endTime(c, 'scraping');

    const tokens = cssToTokens(css);
    return c.json(tokens);
  }),
);

export default app;
