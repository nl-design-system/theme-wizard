#!/usr/bin/env node
import { serve } from '@hono/node-server';
import app from './index.js';

const port = process.env['PORT'] ? Number.parseInt(process.env['PORT'], 10) : 8080;

console.log(`Starting Theme Wizard server on http://localhost:${port}/ ...`);

const server = serve({ port, ...app });

// graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping Theme Wizard server...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Stopping Theme Wizard server...');
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
