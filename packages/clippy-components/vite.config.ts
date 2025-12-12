import { globSync } from 'glob';
import { extname, relative } from 'node:path';
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

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'lit/directives/class-map.js',
        'lit/directives/style-map.js',
        'lit/directives/ref.js',
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
});
