import { ERROR_CODES, extractRef, isRef } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import type ValidationIssue from './index';
import type { ErrorCode } from './index';

export type DesignTokensLike = Record<string, unknown>;

export type ValidationIssueGroup = {
  /**
   * Stable identifier for the group, e.g.
   * `insufficient_contrast:basis.color.default.bg-default|basis.color.default.color-default`.
   * Groups of non-linkable issues use the bare error code.
   */
  id: string;
  code: ErrorCode;
  /** All issues that belong to this group, including the ones only connected through references. */
  issues: ValidationIssue[];
  /** The issue that best explains the group: preferably one on a token that is not a reference itself. */
  representative: ValidationIssue;
};

class DisjointSet {
  readonly #parent: number[];

  constructor(size: number) {
    this.#parent = Array.from({ length: size }, (_, i) => i);
  }

  find(index: number): number {
    let root = index;
    while (this.#parent[root] !== root) root = this.#parent[root];
    // Path compression
    let current = index;
    while (this.#parent[current] !== root) {
      const next = this.#parent[current];
      this.#parent[current] = root;
      current = next;
    }
    return root;
  }

  union(a: number, b: number): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.#parent[rootB] = rootA;
  }
}

/**
 * Follows the `$value` reference chain of the token at `path` and returns every referenced
 * token path, e.g. `['basis.color.default.color-default']` for a component token that
 * references it directly or through intermediate tokens.
 */
const refTargetsOf = (path: string, tokens: DesignTokensLike): string[] => {
  const targets: string[] = [];
  const visited = new Set<string>();
  let current = path;
  while (!visited.has(current)) {
    visited.add(current);
    const token = dlv(tokens, current) as { $value?: unknown } | undefined;
    if (!token || !isRef(token.$value)) break;
    const target = extractRef(token.$value);
    targets.push(target);
    current = target;
  }
  return targets;
};

/** Issues that can be linked to each other through token references. */
const isLinkable = (issue: ValidationIssue): boolean => issue.code === ERROR_CODES.INSUFFICIENT_CONTRAST;

/** Canonical key for the token pair of an issue, order-independent. */
const pairKey = (issue: ValidationIssue): string =>
  issue.tokens && issue.tokens.length > 0 ? [...issue.tokens].sort().join('|') : issue.path;

const pickRepresentative = (groupIssues: ValidationIssue[], tokens: DesignTokensLike): ValidationIssue => {
  // Prefer an issue on a token that is not itself a reference: it points at the root cause
  // rather than at a token that merely inherits the referenced value.
  return groupIssues.find((issue) => refTargetsOf(issue.path, tokens).length === 0) ?? groupIssues[0];
};

/**
 * Groups validation issues into display groups. Contrast issues that involve the same token
 * pair — or that sit on tokens referencing one of those tokens — are merged into a single
 * group, so a change to one coupled token shows up as one issue instead of one per token.
 * All other issues are grouped per error code, as before.
 */
export const groupValidationIssues = (issues: ValidationIssue[], tokens: DesignTokensLike): ValidationIssueGroup[] => {
  const ds = new DisjointSet(issues.length);

  // Map token path -> indices of linkable issues whose `tokens` include it
  const issuesByToken = new Map<string, number[]>();
  issues.forEach((issue, i) => {
    if (!isLinkable(issue)) return;
    for (const tokenPath of issue.tokens ?? []) {
      const list = issuesByToken.get(tokenPath) ?? [];
      list.push(i);
      issuesByToken.set(tokenPath, list);
    }
  });

  // Rule 1: same token pair -> same group. This collapses the two issues that a single
  // failing contrast check emits (one per token of the pair).
  const pairOwners = new Map<string, number>();
  issues.forEach((issue, i) => {
    if (!isLinkable(issue)) return;
    const key = pairKey(issue);
    const owner = pairOwners.get(key);
    if (owner !== undefined) ds.union(owner, i);
    else pairOwners.set(key, i);
  });

  // Rule 2: an issue on a token that references a token of another issue's pair belongs to
  // that group too (e.g. component tokens referencing a failing basis color pair).
  issues.forEach((issue, i) => {
    if (!isLinkable(issue)) return;
    for (const target of refTargetsOf(issue.path, tokens)) {
      for (const j of issuesByToken.get(target) ?? []) {
        if (j !== i) ds.union(i, j);
      }
    }
  });

  const groups: ValidationIssueGroup[] = [];

  // Linkable issues: one group per cluster of connected issues
  const clusters = new Map<number, ValidationIssue[]>();
  issues.forEach((issue, i) => {
    if (!isLinkable(issue)) return;
    const root = ds.find(i);
    const cluster = clusters.get(root) ?? [];
    cluster.push(issue);
    clusters.set(root, cluster);
  });
  for (const cluster of clusters.values()) {
    const involvedTokens = [...new Set(cluster.flatMap((issue) => issue.tokens ?? [issue.path]))].sort();
    groups.push({
      id: `${cluster[0].code}:${involvedTokens.join('|')}`,
      code: cluster[0].code,
      issues: cluster,
      representative: pickRepresentative(cluster, tokens),
    });
  }

  // All other issues: one group per error code (previous behavior)
  const byCode = new Map<ErrorCode, ValidationIssue[]>();
  for (const issue of issues) {
    if (isLinkable(issue)) continue;
    const list = byCode.get(issue.code) ?? [];
    list.push(issue);
    byCode.set(issue.code, list);
  }
  for (const [code, groupIssues] of byCode) {
    groups.push({ id: code, code, issues: groupIssues, representative: groupIssues[0] });
  }

  return groups.sort((a, b) => a.code.localeCompare(b.code) || a.id.localeCompare(b.id));
};
