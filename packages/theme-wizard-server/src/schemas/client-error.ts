import { z } from '@hono/zod-openapi';

export const clientErrorSchema = z
  .object({
    error: z.object({
      name: z.string(),
      message: z.string(),
    }),
    issues: z.optional(
      z.array(
        z.object({
          name: z.string(),
          message: z.string(),
          path: z.optional(z.string()),
        }),
      ),
    ),
    ok: false,
  })
  .openapi({
    example: {
      error: {
        name: 'InvalidUrlError',
        message: 'This URL is not valid',
      },
      ok: false,
    },
    type: 'object',
  });
