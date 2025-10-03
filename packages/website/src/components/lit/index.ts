// Export all Lit components from this barrel file
export { LitThemeApp } from './theme-app/theme-app.js';
export { LitThemeSidebar } from './theme-sidebar/theme-sidebar.js';
export { LitThemePreview } from './theme-preview/theme-preview.js';
export { LitTypographyComponent } from './typography/typography.js';

// Export all types
export * from './types/index.js';

// Register components globally
import './theme-app/theme-app.js';
import './theme-sidebar/theme-sidebar.js';
import './theme-preview/theme-preview.js';
import './typography/typography.js';
