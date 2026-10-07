export const purposes = ['default', 'detail'] as const;
export type Purpose = (typeof purposes)[number];
