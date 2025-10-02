export const isWaybackUrl = (url: string) => {
	try {
		const parsed = new URL(url);
		return parsed.hostname === 'web.archive.org' && /web\/\d{14}\/.+/.test(parsed.pathname)
	} catch {
		return false
	}
};