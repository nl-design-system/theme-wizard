export const concepts = ['inline', 'block', 'text', 'column', 'row'] as const;
export type Concepts = (typeof concepts)[number];
