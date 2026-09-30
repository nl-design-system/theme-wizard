export const variants = ['default', 'detail'] as const;
export type Variant = (typeof variants)[number];
