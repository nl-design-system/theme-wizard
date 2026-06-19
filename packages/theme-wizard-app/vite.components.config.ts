import { globSync } from 'glob';
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
const clippyComponentsSrc = resolve(thisDir, '../clippy-components/src');
const clippyComponentsAssets = resolve(thisDir, '../clippy-components/assets');

export default defineConfig(({ mode }) => ({
  build: {
    // Disabled so `build:app` output (dist/index.js) is not wiped when this runs second in the `build` script
    emptyOutDir: false,
    lib: {
      entry: {
        // Different from `clippy-components/vite.config.ts`:
        // `src/components/` instead of `src/`
        ...getFiles(['src/components/**/*.ts']),
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
        'react',
        'react-dom',
        'react-dom/client',
      ],
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
    dts({
      entryRoot: 'src',
      exclude: ['**/*.test.*', '**/styles.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@lib': resolve(clippyComponentsSrc, 'lib'),
      // More-specific alias must come first: clippy assets live next to src/, not inside it.
      '@nl-design-system-community/clippy-components/assets': clippyComponentsAssets,
      '@nl-design-system-community/clippy-components': clippyComponentsSrc,
      '@src': clippyComponentsSrc,
    },
  },
}));
