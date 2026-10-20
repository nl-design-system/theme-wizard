export const blockAlignments = ['start', 'center'] as const;
export type BlockAlignment = (typeof blockAlignments)[number];
