import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';

/**
 * Silences Vite's default dev/watch banners and replaces them with a single line:
 * the package name plus either the dev server URL or a "done building" message.
 * `vite build` (without --watch) is left untouched so full build output still shows.
 */
export function terseLog(): Plugin {
  const { name } = JSON.parse(readFileSync('./package.json', 'utf8'));
  // Strip the npm scope (e.g. "@nl-design-system-community/") so the log line stays short.
  const label = name.replace(/^@[^/]+\//, '');

  let isServe = false;
  let isWatchBuild = false;

  return {
    name: 'terse-log',
    closeBundle() {
      if (isWatchBuild) {
        console.log(`${label} done building`);
      }
    },
    config(userConfig, { command }) {
      isServe = command === 'serve';
      isWatchBuild = command === 'build' && Boolean(userConfig.build?.watch);

      if (isServe || isWatchBuild) {
        // Keep errors visible, drop the "VITE ready in Xms" / "watching for file changes" info logs.
        return { logLevel: 'error' };
      }

      return undefined;
    },
    configureServer(server) {
      if (!isServe) {
        return;
      }
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address();
        const port = address && typeof address === 'object' ? address.port : server.config.server.port;
        const protocol = server.config.server.https ? 'https' : 'http';
        console.log(`${label} → ${protocol}://localhost:${port}`);
      });
    },
  };
}
