import { globSync } from 'glob';
import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// @see https://rollupjs.org/configuration-options/#input
function getFiles(pattern: string, relativeTo: string) {
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
    emptyOutDir: true,
    lib: {
      entry: {
        ...getFiles('src/components/**/index.ts', 'src/components'),
      },
      formats: ['es'],
    },
    outDir: 'dist-components',
    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'lit/directives/class-map.js',
        'lit/directives/style-map.js',
        'lit/directives/ref.js',
      ],
      input: getFiles('src/components/**/index.ts', 'src/components'),
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    dts({
      entryRoot: 'src/components',
      exclude: ['**/*.test.*', '**/styles.ts'],
      tsconfigPath: './tsconfig.components.json',
    }),
  ],
});

