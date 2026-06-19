import { globSync, readFileSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
const thisDir = fileURLToPath(new URL('.', import.meta.url));

export function getFiles(pattern: string | string[], relativeTo = 'src') {
  return Object.fromEntries(
    globSync(pattern).map((file) => [
      relative(relativeTo, file.slice(0, file.length - extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  );
}

export default defineConfig(() => ({
  build: {
    lib: {
      entry: 'index.ts',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      input: {
        index: fileURLToPath(new URL('index.ts', import.meta.url)),
        ...getFiles(['src/**/index.ts', '!src/test/**/*.ts']),
      },
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
    sourcemap: false,
  },
  plugins: [
    dts({
      compilerOptions: { declarationMap: false },
      entryRoot: 'src',
      exclude: ['**/*.test.*', '**/styles.ts'],
      include: ['src/**/*'],
    }),
    dts({
      compilerOptions: { declarationMap: false },
      entryRoot: '.',
      exclude: ['**/*.test.*', '**/styles.ts'],
      include: ['index.ts', 'src/**/*'],
    }),
  ],
  resolve: {
    alias: {
      '@lib': resolve(thisDir, 'src/lib'),
      '@src': resolve(thisDir, 'src'),
    },
  },
}));
