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
      entry: {
        ...getFiles('src/**/*.ts'),
        ...getFiles('src/**/*.tsx'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', 'lit/directives/class-map.js'],
      output: {
        entryFileNames: '[name].js',
        preserveModules: false,
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
