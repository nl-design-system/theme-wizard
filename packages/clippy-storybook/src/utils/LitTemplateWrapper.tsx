/* @license CC0-1.0 */

import { render, type TemplateResult } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useLayoutEffect, useRef, FC } from 'react';

export interface LitTemplateWrapperProps {
  template: TemplateResult;
}

/**
 * React wrapper component for web components that use Lit templates
 *
 * This component allows Lit templates to be rendered within React Storybook
 * by using Lit's render function to render the template into a DOM element.
 * The wrapper element and Lit comments are removed after rendering.
 */
export const LitTemplateWrapper: FC<LitTemplateWrapperProps> = ({ template }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  const setContainerRef = (element: HTMLDivElement | null) => {
    containerRef.current = element;
    if (element?.parentElement) {
      parentRef.current = element.parentElement;
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current || !parentRef.current) return;

    // Render the template into the temporary container
    render(template, containerRef.current);

    // Remove Lit comment markers
    const walker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_COMMENT, null);
    const commentsToRemove: Comment[] = [];
    let comment;
    while ((comment = walker.nextNode() as Comment | null)) {
      const commentText = comment.textContent || '';
      if (commentText.startsWith('?lit$') || commentText.trim() === '') {
        commentsToRemove.push(comment);
      }
    }
    commentsToRemove.forEach((comment) => comment.remove());

    // Move all children from container to parent
    const fragment = document.createDocumentFragment();
    while (containerRef.current.firstChild) {
      fragment.appendChild(containerRef.current.firstChild);
    }
    parentRef.current.insertBefore(fragment, containerRef.current);

    // Remove the wrapper element
    containerRef.current.remove();
  }, [template]);

  return <div ref={setContainerRef} style={{ display: 'none' }} />;
};

export default LitTemplateWrapper;
