/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { getStories } from './csf-utils';

describe('getStories', () => {
  const mockStories: Record<string, unknown> = {
    default: { title: 'Component' },
    Disabled: { name: 'Disabled', args: { disabled: true } },
    Primary: { name: 'Primary', args: {} },
    Secondary: { name: 'Secondary', args: {} },
  };

  const baseMeta = {
    title: 'Component',
  } as const;

  it('should extract all story objects excluding default', () => {
    const result = getStories(mockStories, baseMeta);

    expect(result).toHaveLength(3);
    expect(result.map(([name, story]) => ({ name, ...(story as Record<string, unknown>) }))).toEqual([
      { name: 'Disabled', args: { disabled: true } },
      { name: 'Primary', args: {} },
      { name: 'Secondary', args: {} },
    ]);
  });

  it('should filter by includeStories with string pattern', () => {
    const meta = { ...baseMeta, includeStories: 'Primary' } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('Primary');
    expect(result[0][1]).toEqual({ name: 'Primary', args: {} });
  });

  it('should filter by includeStories with regex pattern', () => {
    const meta = { ...baseMeta, includeStories: /^(Primary|Secondary)$/ } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('Primary');
    expect(result[1][0]).toBe('Secondary');
  });

  it('should filter by includeStories with array of strings', () => {
    const meta = { ...baseMeta, includeStories: ['Primary', 'Disabled'] };
    const result = getStories(mockStories, meta);

    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('Disabled');
    expect(result[1][0]).toBe('Primary');
  });

  it('should filter by includeStories with array of regex patterns', () => {
    const meta = {
      ...baseMeta,
      includeStories: [/Primary/, /Secondary/],
    } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('Primary');
    expect(result[1][0]).toBe('Secondary');
  });

  it('should filter by excludeStories with string pattern', () => {
    const meta = { ...baseMeta, excludeStories: 'Disabled' } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(2);
    expect(result.some(([name]) => name === 'Disabled')).toBe(false);
  });

  it('should filter by excludeStories with regex pattern', () => {
    const meta = { ...baseMeta, excludeStories: /Disabled|Secondary/ } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('Primary');
  });

  it('should filter by excludeStories with array of strings', () => {
    const meta = { ...baseMeta, excludeStories: ['Secondary', 'Disabled'] };
    const result = getStories(mockStories, meta);

    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('Primary');
  });

  it('should filter by excludeStories with array of regex patterns', () => {
    const meta = {
      ...baseMeta,
      excludeStories: [/Secondary/, /Disabled/],
    } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('Primary');
  });

  it('should combine includeStories and excludeStories', () => {
    const meta = {
      ...baseMeta,
      excludeStories: 'Disabled',
      includeStories: ['Primary', 'Secondary', 'Disabled'],
    } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(2);
    expect(result.some(([name]) => name === 'Disabled')).toBe(false);
    expect(result[0][0]).toBe('Primary');
    expect(result[1][0]).toBe('Secondary');
  });

  it('should return empty array when includeStories matches nothing', () => {
    const meta = { ...baseMeta, includeStories: 'NonExistent' } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(0);
  });

  it('should return empty array when all stories are excluded', () => {
    const meta = {
      ...baseMeta,
      excludeStories: ['Primary', 'Secondary', 'Disabled'],
    } as const;
    const result = getStories(mockStories, meta as any);

    expect(result).toHaveLength(0);
  });

  it('should handle empty stories object', () => {
    const result = getStories({}, baseMeta);

    expect(result).toHaveLength(0);
  });

  it('should handle stories with only default export', () => {
    const result = getStories({ default: { title: 'Component' } }, baseMeta);

    expect(result).toHaveLength(0);
  });

  it('should handle undefined includeStories and excludeStories', () => {
    const meta = {
      ...baseMeta,
      excludeStories: undefined,
      includeStories: undefined,
    };
    const result = getStories(mockStories, meta);

    expect(result).toHaveLength(3);
  });
});
