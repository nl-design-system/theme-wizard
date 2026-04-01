import { type ReactNode } from 'react';

export type PresetTokenLeaf = { $value: string };
export type PresetTokenTree = { [key: string]: PresetTokenTree | PresetTokenLeaf };

/**
 * Creates a nested token structure from a base path and flat token entries.
 **/
export const createPresetTokens = (basePath: string, entries: Record<string, string>): PresetTokenTree => {
  const parts = basePath.split('.');
  const leaves: PresetTokenTree = Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { $value: value }]),
  );

  return parts.reduceRight<PresetTokenTree>((acc, part) => ({ [part]: acc }), leaves);
};

export type WizardStep = {
  order: number;
  stepTitle: string;
};

export const storySampleText = 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.';

export const WizardPreviewSection = ({ children, label }: { children: ReactNode; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <strong style={{ fontSize: '0.875rem' }}>{label}</strong>
    {children}
  </div>
);
