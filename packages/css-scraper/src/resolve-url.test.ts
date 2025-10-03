import { test, expect, describe } from 'vitest';
import { resolveUrl } from './resolve-url';

describe('valid urls', () => {
  const fixtures: [string, URL][] = [
    ['https://example.com', new URL('https://example.com')],
    ['http://example.com', new URL('http://example.com')],
    ['example.com', new URL('https://example.com')],
    ['www.example.com', new URL('https://www.example.com')],
    ['www.com', new URL('https://www.com')],
    ['sub.domain-example.co.uk', new URL('https://sub.domain-example.co.uk')],
    ['example.com?test=1', new URL('https://example.com?test=1')],
    ['example.com#fragment', new URL('https://example.com#fragment')],
    ['example.com/path', new URL('https://example.com/path')],
    ['example.com/path?query=1#fragment', new URL('https://example.com/path?query=1#fragment')],
  ];
  fixtures.forEach(([input, expected]) => {
    test(`${input} => ${expected.toString()}`, () => {
      expect(resolveUrl(input)).toEqual(expected);
    });
  });
});

test('paths with base url', () => {
  expect.soft(resolveUrl('/path', 'https://example.com')).toEqual(new URL('https://example.com/path'));
  expect.soft(resolveUrl('path', 'https://example.com')).toEqual(new URL('https://example.com/path'));
  expect.soft(resolveUrl('path?query=1', 'https://example.com')).toEqual(new URL('https://example.com/path?query=1'));
  expect.soft(resolveUrl('//other.com/path', 'https://example.com')).toEqual(new URL('https://other.com/path'));
});

test('parent paths with base url', () => {
  expect
    .soft(resolveUrl('./style.css', 'https://example.com/lots/of/nested/folders'))
    .toEqual(new URL('https://example.com/lots/of/nested/style.css'));
  expect.soft(resolveUrl('../style.css', 'https://example.com/css/')).toEqual(new URL('https://example.com/style.css'));
  expect
    .soft(resolveUrl('../path/style.css', 'https://example.com/dir/file.css'))
    .toEqual(new URL('https://example.com/path/style.css'));
  expect
    .soft(resolveUrl('../../style.css', 'https://example.com/dir/subdir'))
    .toEqual(new URL('https://example.com/style.css'));
});

describe('invalid urls', () => {
  const fixtures: string[] = ['', 'example', '//example.com', 'a { color: red; } b { font-size: 12px; }'];
  fixtures.forEach((input) => {
    test(input, () => {
      expect(resolveUrl(input)).toBeUndefined();
    });
  });
});
