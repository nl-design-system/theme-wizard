export const purposes = ['default', 'detail'] as const;
export type Purpose = (typeof purposes)[number];

export const sizes = ['md', 'sm', 'xs'] as const;
export type Size = (typeof sizes)[number];
