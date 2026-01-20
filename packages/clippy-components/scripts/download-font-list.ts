import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const assetsDir = join(import.meta.dirname, '../assets/');

if (!process.env['GOOGLE_FONTS_API_KEY']) {
  console.log('No Google Fonts API key available. Using checked-in file.');
  process.exit(0);
}

const {
  items = [],
}: {
  items: { category: string; family: string }[];
} = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env['GOOGLE_FONTS_API_KEY']}`)
  .then((result) => result.json())
  .catch(() => 'Failed to download Google fonts list.');

if (items.length) {
  const filteredItems = items.map(({ category, family }) => ({
    cssUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`,
    label: family,
    value: [family, ...['serif', 'sans-serif', 'monospace'].filter((type) => type === category)],
  }));

  console.log('Saving most recent Google Fonts list to file.');
  writeFileSync(join(assetsDir, './google-fonts.json'), JSON.stringify(filteredItems));
}
