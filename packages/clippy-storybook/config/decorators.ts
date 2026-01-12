/**
 * Helper function to add theme classes to storybook-root
 */
export const addThemeClasses = (root: HTMLElement, context: { title?: string }) => {
  root.classList.add('ma-theme');

  // Add page layout classes for templates
  if (context.title?.startsWith('Templates/')) {
    root.classList.add('utrecht-page-layout', 'utrecht-root');
  }
};
