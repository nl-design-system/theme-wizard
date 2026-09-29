import { TokenPath } from './tokens/base-token';
import { isValueObject } from './tokens/token-reference';

export interface TokenTreeNode {
  key: string;
  path: TokenPath;
  isLeaf: boolean;
  children: TokenTreeNode[];
}

// A node is a leaf once it has a `$type` or a `$value`
// Actual themes have `$value`
// Theme *definitions* have no `$value` but have a `$type` only
const isLeafNode = (data: unknown): boolean =>
  isValueObject(data) && (Object.hasOwn(data, '$type') || Object.hasOwn(data, '$value'));

const buildChildren = (obj: Record<string, unknown>, path: TokenPath): TokenTreeNode[] =>
  Object.keys(obj)
    .filter((key) => !key.startsWith('$'))
    .map((key) => buildNode(key, obj[key], [...path, key]));

const buildNode = (key: string, data: unknown, path: TokenPath): TokenTreeNode => {
  if (isLeafNode(data)) {
    return { children: [], isLeaf: true, key, path };
  }

  const children = isValueObject(data) ? buildChildren(data, path) : [];

  return { children, isLeaf: false, key, path };
};

/** Build a tree of TokenTreeNodes from a token group, e.g. `basisTokens.basis`. */
export const buildTokenTree = (root: Record<string, unknown>): TokenTreeNode[] => buildChildren(root, []);

/** Every branch and leaf path in the tree, e.g. for `getStaticPaths()`. */
export const flattenTreePaths = (tree: TokenTreeNode[]): TokenPath[] => {
  const paths: TokenPath[] = [];
  const walk = (nodes: TokenTreeNode[]) => {
    for (const node of nodes) {
      paths.push(node.path);
      walk(node.children);
    }
  };
  walk(tree);
  return paths;
};

export const findTreeNode = (tree: TokenTreeNode[], path: TokenPath): TokenTreeNode | undefined => {
  let nodes = tree;
  let found: TokenTreeNode | undefined;
  for (const segment of path) {
    found = nodes.find((node) => node.key === segment);
    if (!found) {
      return undefined;
    }
    nodes = found.children;
  }
  return found;
};
