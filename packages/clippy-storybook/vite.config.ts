import { globSync } from 'glob';
import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

//@see https://rollupjs.org/configuration-options/#input
export function getFiles(pattern: string, relativeTo = 'src') {
  return Object.fromEntries(
    globSync(pattern).map((file: string) => {
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
        ...getFiles('src/patterns/**/*.tsx'),
        ...getFiles('src/patterns/**/*.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@utrecht/component-library-react'],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      exclude: ['**/*.stories.*', '**/*.test.*'],
    }),
  ],
});
