import * as z from 'zod';
import { type BaseDesignTokenValue } from './base-token';
import { ColorTokenSchema } from './color-token';

type NestedValue = z.infer<BaseDesignTokenValue> | { [key: string]: NestedValue };

// Recursive schema because groups may be infinitely nested
export const TokenGroupSchema: z.ZodType<NestedValue> = z.lazy(() =>
  z.union([ColorTokenSchema, z.record(z.string(), TokenGroupSchema)]),
);
export type TokenGroup = z.infer<typeof TokenGroupSchema>;
