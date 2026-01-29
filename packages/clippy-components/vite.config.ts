import { globSync } from 'glob';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

//@see https://rollupjs.org/configuration-options/#input
export function getFiles(pattern: string, relativeTo = 'src') {
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

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: {
        ...getFiles('src/**/*.ts'),
        ...getFiles('src/**/*.tsx'),
      },
      formats: ['es'],
    },
    minify: mode !== 'development',
    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'lit/directives/class-map.js',
        'lit/directives/if-defined.js',
        'lit/directives/ref.js',
        'lit/directives/style-map.js',
        'lit/directives/unsafe-svg.js',
      ],
      input: getFiles('src/[!lib]**/index.ts'),
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
