// TODO: take from `@nl-design-system-community/css-scraper` local workspace package
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

app.get('/api/get-css', async (c) => {
  const url = c.req.query('url');

  if (!url || url.trim().length === 0) {
    throw new HTTPException(400, { message: 'missing `url` parameter' });
  }

  const origins = await getCss(url);

  if ('error' in origins) {
    console.error(origins.error);
    throw new HTTPException(500, { cause: origins.error, message: 'encountered a scraping error' });
  }

  return c.json(origins);

  // c.res.headers.set('content-type', 'text/css;utf-8');
  // const css = origins.map((origin) => origin.css).join('');
  // return c.text(css);
});

export default app;
