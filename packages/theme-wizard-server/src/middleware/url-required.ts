import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const requireUrlParam = async (c: Context, next: Next) => {
  const url = c.req.query('url');

  if (!url || url.trim().length === 0) {
    throw new HTTPException(400, {
      message: 'missing `url` parameter: specify a url like ?url=example.com',
    });
  }

  await next();
};
