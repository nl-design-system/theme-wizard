import type { PropertyValues } from 'lit';

/**
 * @description
 * A simpler way to check if properties have changed, to avoid writing
 * `if (changed.has('thingA') || changed.has('anotherAttribute') || changed.has('tokenSubType'))`
 *
 * @example
 * ```ts
 * class MyComponent extends LitElement {
 *   override willUpdate(changed: PropertyValues) {
 *     if(hasChangedProperty(changed, ['theme', 'token', 'path'])) {
 *       // Your code here
 *     }
 *   }
 * }
 * ```
 */
export const hasChangedProperty = (changed: PropertyValues, keys: string[]): boolean => {
  return keys.some((key) => changed.has(key));
};
