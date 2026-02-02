import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(thisDir, 'src');
const templatesRoot = resolve(thisDir, '../theme-wizard-templates');
const templatesSrc = resolve(templatesRoot, 'src');

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
  integrations: [
    react({ jsxImportSource: 'react' }), // Handle JSX transform for story files
  ],
  server: {
    port: 9492, // (T9 for WIZ)2
  },
  vite: {
    resolve: {
      alias: {
        '@': srcDir,
        '@templates': templatesSrc,
      },
    },
    server: {
      fs: {
        allow: [templatesRoot, templatesSrc, ...fontDirs],
      },
    },
  },
});
