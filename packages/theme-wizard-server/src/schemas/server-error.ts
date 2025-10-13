import { z } from '@hono/zod-openapi';

export const serverErrorSchema = z
  .object({
    name: z.optional(z.string()),
    message: z.string(),
    ok: false,
  })
  .openapi({
    example: {
      message: 'Something went wrong',
      ok: false,
    },
    type: 'object',
  });
