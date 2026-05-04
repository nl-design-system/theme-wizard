import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// @astrojs/react only injects the React Fast Refresh preamble on pages with React islands
// (client:* directives). Story .tsx files are dynamically imported via vanilla <script> tags
// and their transformed code checks for window.__vite_plugin_react_preamble_installed__.
// This integration injects the preamble on every page so the check passes.
const reactPreamble = {
  name: 'inject-react-preamble',
  hooks: {
    'astro:config:setup': ({ command, injectScript }) => {
      if (command === 'dev') {
        injectScript(
          'page',
          `import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;`,
        );
      }
    },
  },
};

const thisDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(thisDir, 'src');
const templatesRoot = resolve(thisDir, '../theme-wizard-templates');
const templatesSrc = resolve(templatesRoot, 'src');
const appSrc = resolve(thisDir, '../theme-wizard-app/src');

// Dynamically find all @fontsource packages in .pnpm
// This prevents breaking the path when we update the @fontsource packages because their version number is in the path
const pnpmDir = resolve(thisDir, '../../node_modules/.pnpm');
const fontDirs = readdirSync(pnpmDir)
  .filter((dir) => dir.startsWith('@fontsource+'))
  .map((dir) => resolve(pnpmDir, dir));

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), reactPreamble],
  server: {
    port: 9492, // (T9 for WIZ)2
  },
  vite: {
    resolve: {
      alias: {
        '@': srcDir,
        '@app': appSrc,
        '@templates': templatesSrc,
      },
    },
    server: {
      fs: {
        allow: [srcDir, templatesRoot, templatesSrc, appSrc, ...fontDirs],
      },
    },
  },
});
