import { defineCustomElements } from '@nl-design-system-community/stencil/loader';

if (typeof window !== 'undefined') {
  const start = () => {
    defineCustomElements();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}
