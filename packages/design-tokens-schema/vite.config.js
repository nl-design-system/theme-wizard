import { terseLog } from '@nl-design-system-community/vite-plugin-terse-log';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library. The *-tokens packages stay bundled: they are JSON
      // imports, which Node only accepts with `with { type: 'json' }`, and
      // Rolldown strips that attribute from external imports.
      external: (id) => !/(?:-tokens|\.json)$/.test(id) && deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        // With preserveModules, bundled dependencies are named after their pnpm
        // store path (dist/node_modules/.pnpm/…); flatten them into dist/vendor/
        entryFileNames: ({ name }) => `${name.replace(/^node_modules\/\.pnpm\/[^/]+\/node_modules\//, 'vendor/')}.mjs`,
        // Keep one file per module so consumers can tree-shake unused ones
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [terseLog(), dts({ tsconfigPath: './tsconfig.build.json' })],
});
