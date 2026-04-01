import { type ReactNode } from 'react';
import type { DerivedTokenReference } from '../types';

export type PresetTokenLeaf = { $value: string };
export type PresetTokenTree = { [key: string]: PresetTokenTree | PresetTokenLeaf };
export type PresetOption<TTokens = unknown | null> = {
  derivedTokenReference?: DerivedTokenReference;
  derivedTokenReferences?: DerivedTokenReference[];
  description?: string;
  name: string;
  tokens: TTokens;
};

/**
 * Creates the standard preset options for font sizes relative to the body text size.
 * The generated options derive their value from `nl.paragraph.font-size`.
 */
export const createRelativeFontSizePresetOptions = (
  targetPath: string | string[],
  subject: string,
): PresetOption<Record<string, unknown> | null>[] => [
  {
    name: 'Aanbevolen',
    description: 'Gebruik de standaard uit het startthema.',
    tokens: null,
  },
  {
    name: 'Kleiner dan bodytekst',
    ...(Array.isArray(targetPath)
      ? {
          derivedTokenReferences: targetPath.map((path) => ({
            offset: -1,
            scalePath: 'basis.text.font-size',
            sourcePath: 'nl.paragraph.font-size',
            targetPath: path,
          })),
        }
      : {
          derivedTokenReference: {
            offset: -1,
            scalePath: 'basis.text.font-size',
            sourcePath: 'nl.paragraph.font-size',
            targetPath,
          },
        }),
    description: `Maak ${subject} een stap kleiner dan de gewone paragraph.`,
    tokens: {},
  },
  {
    name: 'Groter dan bodytekst',
    ...(Array.isArray(targetPath)
      ? {
          derivedTokenReferences: targetPath.map((path) => ({
            offset: 1,
            scalePath: 'basis.text.font-size',
            sourcePath: 'nl.paragraph.font-size',
            targetPath: path,
          })),
        }
      : {
          derivedTokenReference: {
            offset: 1,
            scalePath: 'basis.text.font-size',
            sourcePath: 'nl.paragraph.font-size',
            targetPath,
          },
        }),
    description: `Maak ${subject} een stap groter dan de gewone paragraph.`,
    tokens: {},
  },
];

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
