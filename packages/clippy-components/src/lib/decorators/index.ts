/**
 * Custom element decorator with safety check that prevents duplicate registrations.
 *
 * This decorator provides the same functionality as Lit's @customElement but adds
 * a safety check to prevent "already defined" errors when the same element is
 * registered multiple times (e.g., in hot module reloading scenarios).
 *
 * @param tagName - The custom element tag name
 * @returns A class decorator function
 */
export const safeCustomElement = (tagName: string) => {
  return (target: CustomElementConstructor): void => {
    const registry = globalThis.customElements;
    if (registry && !registry.get(tagName)) {
      registry.define(tagName, target);
    }
  };
};
