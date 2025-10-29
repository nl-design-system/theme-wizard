// @ts-check
import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(thisDir, 'src');
const templatesRoot = resolve(thisDir, '../templates');
const templatesSrc = resolve(templatesRoot, 'src');

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
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
        allow: [templatesRoot, templatesSrc],
      },
    },
  },
});
