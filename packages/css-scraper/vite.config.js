import { terseLog } from '@nl-design-system-community/vite-plugin-terse-log';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/get-css.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        // Keep one file per module so consumers can tree-shake unused ones
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [terseLog(), dts()],
});
