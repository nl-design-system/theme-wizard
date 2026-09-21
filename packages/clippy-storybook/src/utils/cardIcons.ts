import React from 'react';

/* Small inline icon helpers — avoid pulling in an icon package for story-only decoration.
 * Shared between clippy-card.stories.tsx and clippy-card-as-link.stories.tsx: both the
 * React.createElement version (for the live preview) and a plain SVG-string version (for the
 * Lit `html` templates used to build the "Show code" source, see ../utils/templateToHtml). */

export const icon = (paths: string[], props: React.SVGProps<SVGSVGElement> = {}) =>
  React.createElement(
    'svg',
    {
      'aria-hidden': 'true',
      fill: 'none',
      height: 20,
      stroke: 'currentColor',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      viewBox: '0 0 24 24',
      width: 20,
      ...props,
    },
    ...paths.map((d) => React.createElement('path', { d, key: d })),
  );

export const iconSvg = (paths: string[], extraAttrs = ''): string => {
  const attrs = extraAttrs ? ` ${extraAttrs}` : '';
  const pathTags = paths.map((d) => `<path d="${d}" />`).join('');
  return `<svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"${attrs}>${pathTags}</svg>`;
};

const arrowRightPaths = ['M5 12l14 0', 'M13 18l6 -6', 'M13 6l6 6'];
const circleCheckPaths = ['M9 12l2 2l4 -4', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0'];
const truckPaths = [
  'M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  'M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  'M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5',
];
const chevronRightPaths = ['M9 6l6 6l-6 6'];
const linkPaths = [
  'M9 15l6 -6',
  'M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464',
  'M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463',
];

export const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement> = {}) => icon(arrowRightPaths, props);
export const CircleCheckIcon = (props: React.SVGProps<SVGSVGElement> = {}) => icon(circleCheckPaths, props);
export const TruckIcon = (props: React.SVGProps<SVGSVGElement> = {}) => icon(truckPaths, props);
export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement> = {}) => icon(chevronRightPaths, props);
export const LinkIcon = (props: React.SVGProps<SVGSVGElement> = {}) => icon(linkPaths, props);

export const arrowRightSvg = iconSvg(arrowRightPaths);
export const circleCheckSvg = (extraAttrs = '') => iconSvg(circleCheckPaths, extraAttrs);
export const truckSvg = (extraAttrs = '') => iconSvg(truckPaths, extraAttrs);
export const chevronRightSvg = iconSvg(chevronRightPaths);
export const linkSvg = (extraAttrs = '') => iconSvg(linkPaths, extraAttrs);
