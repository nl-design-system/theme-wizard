import { test, expect, describe } from 'vitest';
import { isWaybackUrl } from './strip-wayback';

describe('isWaybackUrl', () => {
  test('valid cases', () => {
		const urls = [
			'https://web.archive.org/web/20250311183954/x', // invalid URL but not our concern
			'https://web.archive.org/web/20250311183954/https://www.projectwallace.com/',
			'https://web.archive.org/web/20250322053451/https://www.projectwallace.com/design-tokens'
		];
		for (let url of urls) {
			expect(isWaybackUrl(url)).toBeTruthy()
		}
	})

	test('invalid cases', () => {
		const urls = [
			'',
			'https://example.com',
			'https://archive.org/web/20250322053451/https://www.projectwallace.com/', // missing web. subdomain
			'https://web.archive.org/20250322053451/https://www.projectwallace.com/', // missing /web pathname
			'https://web.archive.org/web/2025032205345/https://www.projectwallace.com/', // incomplete timestamp in pathname
			'https://web.archive.org/web/20250322053451/', // missing data after trailing /
		];
		for (let url of urls) {
			expect(isWaybackUrl(url)).toBeFalsy()
		}
	})
});

