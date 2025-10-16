import { z } from '@hono/zod-openapi';

export const clientErrorSchema = z
  .object({
    errors: z.array(
      z.object({
        name: z.string(),
        message: z.string(),
      }),
    ),
    ok: false,
  })
  .openapi({
    example: {
      errors: [
        {
          name: 'InvalidUrlError',
          message: 'This URL is not valid',
        },
      ],
      ok: false,
    },
    type: 'object',
  });

export type ClientError = z.infer<typeof clientErrorSchema>;
