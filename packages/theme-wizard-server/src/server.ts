#!/usr/bin/env node
import type { AddressInfo } from 'net';
import { serve } from '@hono/node-server';
import app from './index.js';

const port = process.env['PORT'] ? Number.parseInt(process.env['PORT'], 10) : 8080;

console.log('Starting Theme Wizard server...');

const server = serve({ port, ...app });

// Unfortunately Safari 26.2 doesn't support IPv6 addresses, such as: http://[::]:8080/
// https://discussions.apple.com/thread/255221411
// Firefox 147 and Chrome 143 support the IPv6 URLs.
const formatAddressInfo = (addressInfo: string | AddressInfo | null): string =>
  addressInfo
    ? typeof addressInfo === 'string'
      ? addressInfo
      : addressInfo.family === 'IPv6'
        ? `http://[${addressInfo.address}]:${addressInfo.port}/`
        : `http://${addressInfo.address}:${addressInfo.port}/`
    : '';

server.on('listening', () => {
  const address = formatAddressInfo(server.address());
  console.log(`API:\n${address}`);
  console.log(`Documentation:\n${address}api/docs`);
});

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
