import { parse, walk } from 'css-tree'
import { parseHTML } from 'linkedom'
import { resolve_url } from './resolve-url.js'

export const USER_AGENT = 'Project Wallace CSS Scraper/1.1 (+https://www.projectwallace.com/docs/css-scraper)'

function is_wayback_url(url: string) {
	return /^(?:(?:https:)?\/\/)?web\.archive\.org\/web\/\d{14}\/.+/.test(url)
}

/**
 * @description Parse a string of CSS to get all the `@import url()` URL's if there are any
 */
function get_import_urls(css: string): string[] {
	// TODO: including an entire CSS parser is quite heavy for only getting some `@import url()` rules
	const ast = parse(css, {
		parseAtrulePrelude: false,
		parseCustomProperty: false,
		parseRulePrelude: false,
		parseValue: false
	})
	const urls: string[] = []

	walk(ast, function (node) {
		// Can not be a URL inside something else because otherwise this.atrule could never be an import
		if (node.type === 'Url' && this.atrule?.name === 'import') {
			urls.push(node.value)
		}
	})
	return urls
}

async function get_css_file(url: string | URL, abort_signal: AbortSignal) {
	try {
		const response = await fetch(url, {
			headers: {
				'Accept': 'text/css,*/*;q=0.1',
				'User-Agent': USER_AGENT
			},
			// If aborted early try to return an empty string so we can continue with just the content we have
			signal: abort_signal,
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.text()
	} catch (error: unknown) {
		return ''
	}
}

function get_styles(nodes: NodeListOf<Element>, base_url: string) {
	const items = []
	let inline_styles = ''

	for (const node of Array.from(nodes)) {
		if (node.nodeName === 'LINK') {
			const href = node.getAttribute('href')
			items.push({
				css: '',
				href,
				media: node.getAttribute('media'),
				rel: node.getAttribute('rel'),
				type: 'link',
				url: href !== null && href.startsWith('http') ? href : base_url + href
			})
		} else if (node.nodeName === 'STYLE' && node.textContent !== null && node.textContent.trim().length > 0) {
			const css = node.textContent
			items.push({
				css,
				type: 'style',
				url: base_url,
			})
		} else if (node.hasAttribute('style')) {
			let declarations = (node.getAttribute('style') || '').trim()
			if (declarations.length === 0) continue

			// I forgot why I added this, but it's apparently important
			if (!declarations.endsWith(';')) {
				declarations += ';'
			}

			// Try to add a class name to the selector
			const class_attr = node.getAttribute('class')
			let class_name = ''
			if (class_attr !== null && class_attr.length > 0) {
				class_name += '.'
				class_name += class_attr
					.split(/\s+/g)
					.filter((s: string) => {
						if (s.length === 0) return false
						if (s.length === 1) {
							const code = s.charCodeAt(0)
							if (code < 48 || code > 122) return false // 0-9a-zA-Z range
						}
						return true
					})
					.map((s: string) => s.replaceAll(/(\[|\]|:|\.|\/)/g, '\\$1'))
					.join('.')
			}
			const node_name = node.nodeName.toLocaleLowerCase()
			inline_styles += `${node_name}${class_name} { ${declarations} }\n`
		}
	}

	if (inline_styles.length > 0) {
		let inlined = `/* Start Project Wallace extracted inline styles */\n`
		inlined += inline_styles
		inlined += '/** End Project Wallace extracted inline styles */'

		items.push({
			css: inlined,
			type: 'inline',
			url: base_url
		})
	}

	return items
}

export async function get_css(url: string, {
	timeout = 10000,
} = {}) {
	const resolved_url = resolve_url(url)

	if (resolved_url === undefined) {
		return {
			error: {
				message: 'The URL is not valid. Are you sure you entered a URL and not CSS?',
				statusCode: 400,
				url
			}
		}
	}

	let body: string
	let headers: Headers
	const abort_controller = new AbortController()
	const timeout_id = setTimeout(() => abort_controller.abort(), timeout)

	try {
		const response = await fetch(resolved_url, {
			headers: {
				'Accept': 'text/html,*/*;q=0.1',
				'User-Agent': USER_AGENT
			},
			signal: abort_controller.signal
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		body = await response.text()
		headers = response.headers
	} catch (error: unknown) {
		clearTimeout(timeout_id)

		if (typeof error === 'object' && error !== null && 'message' in error) {
			// Examples: chatgpt.com
			if (error.message === 'Forbidden') {
				return {
					error: {
						message: "The origin server responded with a 403 Forbidden status code which means that scraping CSS is blocked. Is the URL publicly accessible?",
						statusCode: 403,
						url
					}
				}
			}

			// Examples: localhost, sduhsdf.test
			if (error.message === 'fetch failed') {
				let message = "The origin server is refusing connections."
				if (url.includes('localhost') || url.includes('192.168') || url.includes('127.0.0.1')) {
					message += " You are trying to scrape a local server. Make sure to use a public URL."
				}

				return {
					error: {
						message,
						statusCode: 400,
						url,
					}
				}
			}

			// Examples: projectwallace.com/auygsdjhgsj
			if (error.message === 'Not Found') {
				return {
					error: {
						message: "The origin server responded with a 404 Not Found status code.",
						statusCode: 404,
						url
					}
				}
			}
		}

		// Generic error handling (TODO: add test case)
		return {
			error: {
				message: 'something went wrong',
				statusCode: 500,
				url,
			}
		}
	}

	// Return early if our response was a CSS file already
	if (headers.get('content-type')?.includes('text/css')) {
		clearTimeout(timeout_id)
		return [
			{
				css: body,
				href: url,
				type: 'file'
			}
		]
	}

	// Remove the Wayback Machine toolbar if it's present
	const START_COMMENT = '<!-- BEGIN WAYBACK TOOLBAR INSERT -->'
	const END_COMMENT = '<!-- END WAYBACK TOOLBAR INSERT -->'

	const start_insert = body.indexOf(START_COMMENT)
	const end_insert = body.indexOf(END_COMMENT)

	if (start_insert !== -1 && end_insert !== -1) {
		body = body.substring(0, start_insert) + body.substring(end_insert + END_COMMENT.length)
	}

	const { document } = parseHTML(body)

	// If the URL is an archive.org URL, we need to strip out the archive injected stuff
	if (is_wayback_url(url)) {
		const injected_links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href^="https://web-static.archive.org"]')
		for (const link of Array.from(injected_links)) {
			link.remove()
		}
	}

	const nodes = document.querySelectorAll<HTMLLinkElement>('link[rel*="stylesheet"][href], style, [style]')
	const baseElement = document.querySelector('base[href]')
	const baseUrl = (baseElement !== null && baseElement.hasAttribute('href')) ? baseElement.getAttribute('href') : resolved_url
	const items = get_styles(nodes, baseUrl?.toString() || '') || []
	const result = []

	for (const item of items) {
		if (item.type === 'link' && item.href) {
			if (item.href.startsWith('data:text/css')) {
				const comma_position = item.href.indexOf(',')
				const encoded = item.href.substring(comma_position)
				item.css = Buffer.from(encoded, 'base64').toString('ascii')
			} else {
				const file_url = resolve_url(item.href, resolved_url)
				if (file_url === undefined) {
					continue
				}
				item.css = await get_css_file(file_url, abort_controller.signal)
				// Set the URL to the resolved URL to fix relative URLs
				// e.g. ./styles.css -> https://example.com/styles.css
				item.url = file_url.toString()
			}

			result.push(item)
		}

		if (item.type === 'style' || item.type === 'inline') {
			result.push(item)
		}

		if (item.type === 'style' || item.type === 'link') {
			// Resolve @import CSS 1 level deep (to avoid infinite loops)
			// And c'mon, don't @import inside your @import.
			const importUrls = get_import_urls(item.css)
			if (importUrls.length > 0) {
				const cssRequests = importUrls.map((importUrl) => get_css_file(resolve_url(importUrl, url)!, abort_controller.signal))
				const importedFiles = await Promise.all(cssRequests)
				importedFiles.forEach((css, index) => {
					result.push({
						css,
						href: importUrls[index],
						type: 'import'
					})
				})
			}
		}
	}


	clearTimeout(timeout_id)

	return result
}