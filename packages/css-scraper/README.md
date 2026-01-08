# CSS Scraper

Fetch and parse CSS from HTML documents, including CSS from linked stylesheets, embedded style tags, and `@import` rules.

## Features

- Scrape CSS from remote websites
- Extract CSS from `<link>` tags, `<style>` tags, and inline `style` attributes
- Recursively follow `@import` rules
- Comprehensive error handling with descriptive error types
- Customizable user agent and request timeout
- Parse and extract design tokens from CSS

## Installation

```sh
npm install @nl-design-system-community/css-scraper
```

## Usage

### Getting CSS from a URL

```ts
import { getCss } from '@nl-design-system-community/css-scraper';

// Get all CSS from a URL
const css = await getCss('https://example.com');
console.log(css);
```

### Getting structured CSS resources

If you need more detail about where the CSS came from, use `getCssResources`:

```ts
import { getCssResources } from '@nl-design-system-community/css-scraper';

const resources = await getCssResources('https://example.com');

// Returns an array of resources with type information:
// - 'file': Direct CSS file response
// - 'link': CSS referenced via <link> tag
// - 'style': CSS in <style> tag
// - 'inline': CSS in style attributes
// - 'import': CSS from @import rules

for (const resource of resources) {
  console.log(`Type: ${resource.type}, CSS length: ${resource.css.length}`);
}
```

### Custom user agent and timeout

You can override the default user agent and request timeout for both `getCss` and `getCssResources`:

```ts
import { getCss, getCssResources } from '@nl-design-system-community/css-scraper';

// Custom user agent
const css = await getCss('https://example.com', {
  userAgent: 'My Custom Bot/1.0',
});

// Custom timeout (in milliseconds)
const css = await getCss('https://example.com', {
  timeout: 5000,
});
```

### Error handling

The package provides specific error types for different failure scenarios:

```ts
import {
  getCss,
  ForbiddenError,
  NotFoundError,
  ConnectionRefusedError,
  InvalidUrlError,
  TimeoutError,
  ScrapingError,
} from '@nl-design-system-community/css-scraper';

try {
  const css = await getCss('https://example.com');
} catch (error) {
  if (error instanceof ForbiddenError) {
    console.error('Scraping is blocked (403)');
  } else if (error instanceof NotFoundError) {
    console.error('URL not found (404)');
  } else if (error instanceof ConnectionRefusedError) {
    console.error('Server refused connection');
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof InvalidUrlError) {
    console.error('Invalid URL provided');
  } else if (error instanceof ScrapingError) {
    console.error('Other scraping error:', error.message);
  }
}
```

### Extracting design tokens

If your CSS contains design tokens in CSS custom properties, you can extract them:

```ts
import { getDesignTokens } from '@nl-design-system-community/css-scraper';

const css = `
  :root {
    --color-primary: #0066cc;
    --color-text: #333;
    --spacing-unit: 8px;
  }
`;

const tokens = getDesignTokens(css);
console.log(tokens);
// {
//   "color-primary": "#0066cc",
//   "color-text": "#333",
//   "spacing-unit": "8px"
// }
```
