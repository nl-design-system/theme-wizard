// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  output: 'server',
  vite: {
    server: {
      // Add middleware to handle URL parameter conflicts
      middlewareMode: false,
    },
    // Fix for Vite 403 error when using URL query parameters in development
    // https://github.com/vitejs/vite/pull/20410 - current Vite version (6.3.6 via Astro dependency) does not include this fix
    // This middleware plugin prevents Vite from interpreting query parameters as file paths,
    // which causes 403 "outside of Vite serving allow list" errors on page refresh.
    // TODO: Remove this plugin when upgrading to Astro version that includes Vite 7.1+
    plugins: [
      {
        name: 'fix-url-params',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // If the request has query parameters, treat it as a page request
            if (req.url && req.url.includes('?')) {
              // Extract the path part (before the ?)
              const pathPart = req.url.split('?')[0];
              // If it's just the root path with query params, serve the index
              if (pathPart === '/') {
                req.url = '/';
              }
            }
            next();
          });
        },
      },
    ],
  },
});
