import { createContext } from '@lit/context';

/**
 * Context for token paths of wizard steps the user has completed
 */
export const completedStepsContext = createContext<string[]>('completedSteps');
