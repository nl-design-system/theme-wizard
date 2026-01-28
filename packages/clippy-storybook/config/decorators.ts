import { THEMES } from './themes/theme-data';

const stylesheetExists = (href: string): HTMLLinkElement | undefined =>
  Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).find((link) => link.href === href);

const ensureThemeStylesheet = (root: HTMLElement, themeClassName: string) => {
  const head = document.querySelector('head');
  if (!head) return;

  const theme = THEMES.find(({ className }) => className === themeClassName);
  if (!theme) return;

  const existing = stylesheetExists(theme.href);
  if (existing) {
    return;
  }

  root.classList.add('theme-loading');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = theme.href;

  link.onload = () => {
    root.classList.remove('theme-loading');
  };

  head.appendChild(link);
};

/**
 * Helper function to add theme classes to storybook-root
 */
export const addThemeClasses = (root: HTMLElement, context: { title?: string; globals?: { theme?: string } }) => {
  // Remove any previously applied theme classes
  THEMES.forEach(({ className }) => root.classList.remove(className));

  const selectedTheme = context.globals?.theme ?? 'ma-theme';
  root.classList.add(selectedTheme);

  ensureThemeStylesheet(root, selectedTheme);

  // Add page layout classes for templates
  if (context.title?.startsWith('Templates/')) {
    root.classList.add('utrecht-page-layout', 'utrecht-root', 'preview-theme');
  }
};
