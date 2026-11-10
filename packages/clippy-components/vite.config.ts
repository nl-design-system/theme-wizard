import { terseLog } from '@nl-design-system-community/vite-plugin-terse-log';
import { globSync, readFileSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

//@see https://rollupjs.org/configuration-options/#input
export function getFiles(pattern: string | string[], relativeTo = 'src') {
  return Object.fromEntries(
    globSync(pattern).map((file) => {
      return [
        relative(relativeTo, file.slice(0, file.length - extname(file).length)),
        fileURLToPath(new URL(file, import.meta.url)),
      ];
    }),
  );
}

const thisDir = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default defineConfig(() => ({
  build: {
    lib: {
      entry: {
        ...getFiles(['src/**/*.ts']),
      },
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id: string) =>
        // Vite query imports (`?inline` CSS, `?raw` icons) only resolve in Vite, so they stay bundled.
        // So do the *-tokens packages: they are JSON imports, which Node only accepts with
        // `with { type: 'json' }`, and Rolldown strips that attribute from external imports.
        !id.includes('?') &&
        !/(?:-tokens|\.json)$/.test(id) &&
        deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      input: getFiles('src/**/index.ts'),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.every((name) => name.endsWith('.json'))) {
            return '[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    terseLog(),
    dts({
      entryRoot: 'src',
      exclude: ['**/*.test.*', '**/styles.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@lib': resolve(thisDir, 'src/lib'),
      '@src': resolve(thisDir, 'src'),
    },
  },
}));
