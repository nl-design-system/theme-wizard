import postcss, { type AtRule, type Container, type Rule } from 'postcss';
import type { DerivedTokenReference, WizardPreviewLayoutProps, WizardPreviewSectionProps } from '../types';

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
};

export const storySampleText = 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.';

export const createPresetStory = <TArgs,>({
  name,
  args,
  description,
  options,
  order,
  question,
}: {
  args: TArgs;
  description?: string;
  name: string;
  options: PresetOption<Record<string, unknown> | null>[];
  order: number;
  question: string;
}) => ({
  name,
  args,
  parameters: {
    presets: [{ ...(description ? { description } : {}), name: question, options }],
    wizard: { order, previewStoryIds: ['WizardPreview'], type: 'preset' },
  },
});

export type ForcedPseudoStateConfig = {
  pseudos: string[];
  selectorFilter?: (selector: string) => boolean;
};

const createForcedStateRule = (targetId: string, declarations: string, atRules: AtRule[]): string => {
  let css = `#${targetId}, #${targetId}:hover { ${declarations} }`;

  for (let index = atRules.length - 1; index >= 0; index -= 1) {
    const atRule = atRules[index];
    css = `@${atRule.name} ${atRule.params} { ${css} }`;
  }

  return css;
};

const collectForcedStateRules = (
  container: Container,
  pseudo: string,
  selectorFilter: ForcedPseudoStateConfig['selectorFilter'],
  targetId: string,
  atRules: AtRule[] = [],
): string[] => {
  const rules: string[] = [];

  for (const node of container.nodes ?? []) {
    if (node.type === 'atrule') {
      if (node.nodes) {
        rules.push(...collectForcedStateRules(node, pseudo, selectorFilter, targetId, [...atRules, node]));
      }
      continue;
    }

    if (node.type !== 'rule') continue;

    const matchingSelector = node.selectors.find(
      (selector) => selector.includes(`:${pseudo}`) && (!selectorFilter || selectorFilter(selector)),
    );

    if (!matchingSelector) continue;

    const declarations = node.nodes
      .map((child) => child.toString().trim())
      .filter(Boolean)
      .join('; ');
    rules.push(createForcedStateRule(targetId, declarations, atRules));
  }

  return rules;
};

/**
 * Extracts CSS rules for the given pseudo-states from a component's inline CSS string
 * and returns them as a string, ready to render in a <style> tag.
 *
 * @param css - The component's inline CSS string (imported with `?inline`)
 * @param states - Map of element ID to pseudo-state config. Pass `string[]` as shorthand for `{ pseudos }`.
 *   Optionally provide `selectorFilter` to match only specific CSS selectors (e.g. per button variant).
 *   e.g. `{ 'link-hover': ['hover'], 'btn-primary-hover': { pseudos: ['hover'], selectorFilter: (s) => s.includes('--primary') } }`
 */
export function buildForcedPseudoStateStyles(
  css: string,
  states: Record<string, string[] | ForcedPseudoStateConfig>,
): string {
  const root = postcss.parse(css);
  const rules: string[] = [];

  for (const [targetId, config] of Object.entries(states)) {
    const pseudos = Array.isArray(config) ? config : config.pseudos;
    const selectorFilter = Array.isArray(config) ? undefined : config.selectorFilter;

    for (const pseudo of pseudos) {
      rules.push(...collectForcedStateRules(root, pseudo, selectorFilter, targetId));
    }
  }

  return rules.join('\n');
}
/**
 * Renders a labeled preview section for grouping related wizard preview content.
 *
 * @param children - Preview content to render below the section label.
 * @param label - Section heading shown above the preview content.
 * @returns A vertically stacked preview section with a bold label.
 */
export const WizardPreviewSection = ({ children, label }: WizardPreviewSectionProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}
  >
    <strong>{label}</strong>
    {children}
  </div>
);

/**
 * Renders the shared layout for wizard previews and optionally injects forced pseudo-state styles.
 *
 * @param children - Preview items to render inside the flexible layout container.
 * @param css - Inline component CSS used to extract pseudo-state declarations.
 * @param states - Map of element IDs to pseudo-states that should be rendered as static preview styles.
 * @returns A wrapped preview layout with optional pseudo-state style injection.
 */
export const WizardPreviewLayout = ({ children, css, states }: WizardPreviewLayoutProps) => (
  <>
    {css && states && <style>{buildForcedPseudoStateStyles(css, states)}</style>}
    <div
      style={{
        alignItems: 'center',
        columnGap: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '1rem',
      }}
    >
      {children}
    </div>
  </>
);
