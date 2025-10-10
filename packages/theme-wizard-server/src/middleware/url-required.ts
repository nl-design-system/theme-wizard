import type { Context, Next } from 'hono';
import { resolveUrl } from '@nl-design-system-community/css-scraper';
import { HTTPException } from 'hono/http-exception';
import * as v from 'valibot';

export const urlSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty('URL should not be empty'),
  v.custom<string>((input: unknown) => {
    if (typeof input !== 'string') return false;
    return resolveUrl(input) !== undefined;
  }, 'Expected a valid URL-like string (protocol and www. optional)'),
);

// export const requireUrlParam = async (c: Context, next: Next) => {
//   const url = c.req.query('url');

//   if (!v.safeParse(urlSchema, url).success) {
//     throw new HTTPException(400, {
//       message: 'missing `url` parameter: specify a url like ?url=example.com',
//     });
//   }

//   await next();
// };
