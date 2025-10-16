import { z } from '@hono/zod-openapi';

export const serverErrorSchema = z
  .object({
    error: z.object({
      name: z.optional(z.string()),
      message: z.string(),
    }),
    ok: z.literal(false),
  })
  .openapi({
    example: {
      error: {
        message: 'Something went wrong',
      },
      ok: false,
    },
    type: 'object',
  });

export type ServerError = z.infer<typeof serverErrorSchema>;
