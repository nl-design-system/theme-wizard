export function resolve_url(url: string, base_url?: string | URL): URL | undefined {
	// validate base_url if given
	if (base_url) {
		try {
			const base = new URL(base_url)
			if (!base.protocol || !base.hostname) {
				return undefined
			}
			return new URL(url, base)
		} catch {
			return undefined
		}
	}

	// try as full URL
	try {
		return new URL(url)
	} catch {
		// do nothing, continue to check in next block
	}

	// allow domain-like without scheme (any a-z0-9.- and a dot with 2+ letters)
	// and optional path, query or fragment
	if (/^[a-z0-9.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(url)) {
		return new URL(`https://${url}`)
	}

	return undefined
}