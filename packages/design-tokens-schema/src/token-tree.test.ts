import { describe, expect, it } from 'vitest';
import { buildTokenTree, findTreeNode, flattenTreePaths } from './token-tree';

describe('buildTokenTree', () => {
  it('builds a leaf node for a token with only $type (definition-only source)', () => {
    const tree = buildTokenTree({ 'bg-default': { $type: 'color' } });

    expect(tree).toEqual([{ children: [], isLeaf: true, key: 'bg-default', path: ['bg-default'] }]);
  });

  it('builds a leaf node for a token with only $value', () => {
    const tree = buildTokenTree({ primary: { $value: '#ff0000' } });

    expect(tree).toEqual([{ children: [], isLeaf: true, key: 'primary', path: ['primary'] }]);
  });

  it('builds a leaf node for a fully-resolved token with both $type and $value', () => {
    const tree = buildTokenTree({ primary: { $type: 'color', $value: '#ff0000' } });

    expect(tree).toEqual([{ children: [], isLeaf: true, key: 'primary', path: ['primary'] }]);
  });

  it('builds a branch node with children for a group', () => {
    const tree = buildTokenTree({
      color: {
        default: { $type: 'color' },
      },
    });

    expect(tree).toEqual([
      {
        children: [
          {
            children: [],
            isLeaf: true,
            key: 'default',
            path: ['color', 'default'],
          },
        ],
        isLeaf: false,
        key: 'color',
        path: ['color'],
      },
    ]);
  });

  it('handles non-uniform depth across sibling groups', () => {
    const tree = buildTokenTree({
      color: {
        default: {
          'bg-default': { $type: 'color' },
        },
      },
      size: {
        md: { $type: 'dimension' },
      },
    });

    const colorLeaf = findTreeNode(tree, ['color', 'default', 'bg-default']);
    const sizeLeaf = findTreeNode(tree, ['size', 'md']);

    expect(colorLeaf?.isLeaf).toBe(true);
    expect(sizeLeaf?.isLeaf).toBe(true);
  });

  it('skips $-prefixed keys when listing children of a group', () => {
    const tree = buildTokenTree({
      color: {
        $description: 'a group description',
        $extensions: { foo: 'bar' },
        default: { $type: 'color' },
      },
    });

    expect(tree).toHaveLength(1);
    expect(tree[0]?.children).toHaveLength(1);
    expect(tree[0]?.children.map((child) => child.key)).toEqual(['default']);
  });

  it('does not walk into a token-like value nested inside $extensions', () => {
    const tree = buildTokenTree({
      color: {
        $extensions: {
          'link-to-some-other-token': { $type: 'color', $value: '#ffffff' },
        },
        default: { $type: 'color' },
      },
    });

    expect(tree[0]?.children.map((child) => child.key)).toEqual(['default']);
    expect(flattenTreePaths(tree)).toHaveLength(2); // `color` and `color.default`
  });

  it('skips $-prefixed keys at the root', () => {
    const tree = buildTokenTree({
      $description: 'root description',
      color: { default: { $type: 'color' } },
    });

    expect(tree.map((node) => node.key)).toEqual(['color']);
  });

  it('sets the full path for deeply nested nodes', () => {
    const tree = buildTokenTree({
      color: {
        default: {
          'bg-default': { $type: 'color' },
        },
      },
    });

    const leaf = tree[0]?.children[0]?.children[0];
    expect(leaf?.path).toEqual(['color', 'default', 'bg-default']);
  });

  it('sets key equal to the last path segment', () => {
    const tree = buildTokenTree({
      color: {
        default: {
          'bg-default': { $type: 'color' },
        },
      },
    });

    const color = tree[0];
    const defaultGroup = color?.children[0];
    const bgDefault = defaultGroup?.children[0];

    expect(color?.key).toBe('color');
    expect(defaultGroup?.key).toBe('default');
    expect(bgDefault?.key).toBe('bg-default');
  });

  it('returns an empty array for an empty root object', () => {
    expect(buildTokenTree({})).toEqual([]);
  });

  it('treats a primitive value as a childless, non-leaf node', () => {
    const tree = buildTokenTree({ foo: 'bar' });

    expect(tree).toEqual([{ children: [], isLeaf: false, key: 'foo', path: ['foo'] }]);
  });

  it('treats an array value as a childless, non-leaf node', () => {
    const tree = buildTokenTree({ list: [1, 2, 3] });

    expect(tree).toEqual([{ children: [], isLeaf: false, key: 'list', path: ['list'] }]);
  });

  it('does not treat a group with $-prefixed metadata but no $type/$value as a leaf', () => {
    const tree = buildTokenTree({
      color: {
        $description: 'just a group',
        default: { $type: 'color' },
      },
    });

    expect(tree[0]?.isLeaf).toBe(false);
  });
});

describe('flattenTreePaths', () => {
  it('returns an empty array for an empty tree', () => {
    expect(flattenTreePaths([])).toEqual([]);
  });

  it('includes both branch and leaf paths', () => {
    const tree = buildTokenTree({
      color: {
        default: {
          'bg-default': { $type: 'color' },
        },
      },
    });

    expect(flattenTreePaths(tree)).toEqual([['color'], ['color', 'default'], ['color', 'default', 'bg-default']]);
  });

  it('visits a node before its own children (pre-order)', () => {
    const tree = buildTokenTree({
      color: { default: { $type: 'color' } },
    });

    const paths = flattenTreePaths(tree);
    const indexOfParent = paths.findIndex((path) => path.join('.') === 'color');
    const indexOfChild = paths.findIndex((path) => path.join('.') === 'color.default');

    expect(indexOfParent).toBeLessThan(indexOfChild);
  });

  it('includes every sibling path at each level', () => {
    const tree = buildTokenTree({
      color: {
        accent: { $type: 'color' },
        default: { $type: 'color' },
      },
    });

    expect(flattenTreePaths(tree)).toEqual([['color'], ['color', 'accent'], ['color', 'default']]);
  });
});

describe('findTreeNode', () => {
  const tree = buildTokenTree({
    color: {
      default: {
        'bg-default': { $type: 'color' },
      },
    },
    size: {
      md: { $type: 'dimension' },
    },
  });

  it('finds a top-level branch node', () => {
    expect(findTreeNode(tree, ['color'])?.key).toBe('color');
  });

  it('finds a mid-level branch node', () => {
    expect(findTreeNode(tree, ['color', 'default'])?.key).toBe('default');
  });

  it('finds a deeply nested leaf node', () => {
    const node = findTreeNode(tree, ['color', 'default', 'bg-default']);
    expect(node).toMatchObject({ isLeaf: true, key: 'bg-default' });
  });

  it('finds a leaf node at a shallower depth than other branches', () => {
    expect(findTreeNode(tree, ['size', 'md'])?.isLeaf).toBe(true);
  });

  it('returns undefined for an unknown top-level segment', () => {
    expect(findTreeNode(tree, ['unknown'])).toBeUndefined();
  });

  it('returns undefined for an unknown nested segment', () => {
    expect(findTreeNode(tree, ['color', 'unknown'])).toBeUndefined();
  });

  it('returns undefined when the path goes deeper than an existing leaf', () => {
    expect(findTreeNode(tree, ['color', 'default', 'bg-default', 'in-too-deep'])).toBeUndefined();
  });

  it('returns undefined for an empty path', () => {
    expect(findTreeNode(tree, [])).toBeUndefined();
  });

  it('returns undefined when searching an empty tree', () => {
    expect(findTreeNode([], ['color'])).toBeUndefined();
  });
});
