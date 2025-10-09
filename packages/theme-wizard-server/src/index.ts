import { getCss as getCssOrigins } from '@nl-design-system-community/css-scraper';
import { css_to_tokens as cssToTokens } from '@projectwallace/css-design-tokens';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
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

app.get('/healthz', (c) => {
  return c.json({});
});

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

app.get(
  '/api/v1/css-design-tokens',
  requireUrlParam,
  withScrapingErrorHandler(async (c) => {
    const url = c.req.query('url')!;
    const startTime = Date.now();
    const origins = await getCssOrigins(url);
    const css = origins.map((origin) => origin.css).join('');
    const endTime = Date.now();
    const tokens = cssToTokens(css);

    c.res.headers.set('server-timing', `scraping;desc="Scraping CSS";dur=${endTime - startTime}`);
    return c.json(tokens);
  }),
);

export default app;
