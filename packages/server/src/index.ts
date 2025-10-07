import { getCss } from '@nl-design-system-community/css-scraper';
import { Hono } from 'hono';
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

app.get('/api/get-css', async (c) => {
  const url = c.req.query('url');

  if (!url || url.trim().length === 0) {
    throw new HTTPException(400, { message: 'missing `url` parameter: specify a url like ?url=example.com' });
  }

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
});

export default app;
