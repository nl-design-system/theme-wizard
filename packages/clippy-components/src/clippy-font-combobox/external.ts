import { items } from './google-fonts.json';

export default items.map(({ category, family }) => ({
  cssUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`,
  label: family,
  value: [family, ...['serif', 'sans-serif', 'monospace'].filter((type) => type === category)],
}));
