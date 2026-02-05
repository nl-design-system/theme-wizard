/// <reference types="./custom-elements.d.ts" />

declare const __STANDALONE_PACKAGE__: boolean;

declare module '@nl-design-system-community/theme-wizard-app';
declare module '@utrecht/web-component-library-stencil/loader/index.js';

declare module '*.svg' {
  const content: {
    src: string;
    height: number;
    width: number;
  };
  export default content;
}
