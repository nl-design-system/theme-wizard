/**
 * Clones a `<template>` element by id.
 *
 * - Without a selector: returns the raw `DocumentFragment`.
 * - With a selector: returns the first matching element inside the clone,
 *   cast to the requested type.
 */
export function cloneTemplate(id: string): DocumentFragment;
export function cloneTemplate<T extends Element>(id: string, selector: string): T;
export function cloneTemplate<T extends Element>(id: string, selector?: string): DocumentFragment | T {
  const tmpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tmpl) throw new Error(`Template #${id} not found`);

  const fragment = tmpl.content.cloneNode(true) as DocumentFragment;
  if (!selector) return fragment;

  const el = fragment.querySelector<T>(selector);
  if (!el) throw new Error(`Selector "${selector}" not found in template #${id}`);
  return el;
}
