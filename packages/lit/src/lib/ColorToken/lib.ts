export function createHelperElement() {
  const canRunInBrowser = CSS?.supports('color', 'oklch(from red l c h');
  if (!canRunInBrowser) return null;

  const element = document.createElement('div');
  element.style.display = 'none';
  document.body.appendChild(element);
  return element;
}

const numberPattern = '(-?[\\d.]+(?:e[+-]?\\d+)?)';
const colorComponentRegex = new RegExp(`${numberPattern}\\s+${numberPattern}\\s+${numberPattern}\\)$`);

export function getCSSColorComponents(value: string) {
  const [, a, b, c] = colorComponentRegex.exec(value)?.map(Number) || [NaN, NaN, NaN, NaN];
  const components: [number, number, number] = [a, b, c];
  return components;
}
