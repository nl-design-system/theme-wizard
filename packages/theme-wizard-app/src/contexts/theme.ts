import { createContext } from '@lit/context';
import type Theme from '../lib/Theme';

/**
 * Context for sharing Theme instance across route components
 */
export const themeContext = createContext<Theme>('theme');
