/* @license CC0-1.0 */

import { render, type TemplateResult } from 'lit';
import React, { useEffect, useRef } from 'react';

export interface LitTemplateWrapperProps {
  template: TemplateResult;
}

/**
 * React wrapper component for web components that use Lit templates
 *
 * This component allows Lit templates to be rendered within React Storybook
 * by using Lit's render function to render the template into a DOM element.
 */
export const LitTemplateWrapper: React.FC<LitTemplateWrapperProps> = ({ template }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      render(template, containerRef.current);
    }
  }, [template]);

  return <div ref={containerRef} />;
};

export default LitTemplateWrapper;
