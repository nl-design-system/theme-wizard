import { test, expect, describe } from "vitest"
import { resolve_url } from "./resolve-url"

describe('valid urls', () => {
	; ([
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
	] satisfies Array<[string, URL]>).forEach(([input, expected]) => {
		test(`${input} => ${expected.toString()}`, () => {
			expect(resolve_url(input)).toEqual(expected)
		})
	})
})

test('paths with base url', () => {
	expect.soft(resolve_url('/path', 'https://example.com')).toEqual(new URL('https://example.com/path'))
	expect.soft(resolve_url('path', 'https://example.com')).toEqual(new URL('https://example.com/path'))
	expect.soft(resolve_url('path?query=1', 'https://example.com')).toEqual(new URL('https://example.com/path?query=1'))
	expect.soft(resolve_url('//other.com/path', 'https://example.com')).toEqual(new URL('https://other.com/path'))
})

test('parent paths with base url', () => {
	expect.soft(resolve_url('./style.css', 'https://example.com/lots/of/nested/folders')).toEqual(new URL('https://example.com/lots/of/nested/style.css'))
	expect.soft(resolve_url('../style.css', 'https://example.com/css/')).toEqual(new URL('https://example.com/style.css'))
	expect.soft(resolve_url('../path/style.css', 'https://example.com/dir/file.css')).toEqual(new URL('https://example.com/path/style.css'))
	expect.soft(resolve_url('../../style.css', 'https://example.com/dir/subdir')).toEqual(new URL('https://example.com/style.css'))
})

describe('invalid urls', () => {
	; ([
		'',
		'example',
		'//example.com',
		'a { color: red; } b { font-size: 12px; }',
	] satisfies Array<string>).forEach((input) => {
		test(input, () => {
			expect(resolve_url(input)).toBeUndefined()
		})
	})
})