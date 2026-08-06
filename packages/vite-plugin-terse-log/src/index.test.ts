import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { terseLog } from './index';

type ConfigHook = (
  config: { build?: { watch?: unknown } },
  env: { command: 'build' | 'serve' },
) => { logLevel?: string } | undefined;

type ConfigureServerHook = (server: {
  config: { server: { https?: boolean; port?: number } };
  httpServer: { address: () => { port: number } | null; once: (event: 'listening', cb: () => void) => void } | null;
}) => void;

type CloseBundleHook = () => void;

describe('terseLog', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('sets logLevel to error for the dev server', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;

    expect(config({}, { command: 'serve' })).toEqual({ logLevel: 'error' });
  });

  it('sets logLevel to error for a watch build', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;

    expect(config({ build: { watch: {} } }, { command: 'build' })).toEqual({ logLevel: 'error' });
  });

  it('leaves a plain build untouched', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;

    expect(config({}, { command: 'build' })).toBeUndefined();
  });

  it('logs "<name> done building" after each rebuild in watch mode', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const closeBundle = plugin.closeBundle as CloseBundleHook;

    config({ build: { watch: {} } }, { command: 'build' });
    closeBundle();

    expect(logSpy).toHaveBeenCalledWith('vite-plugin-terse-log done building');
  });

  it('does not log on closeBundle for a plain build', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const closeBundle = plugin.closeBundle as CloseBundleHook;

    config({}, { command: 'build' });
    closeBundle();

    expect(logSpy).not.toHaveBeenCalled();
  });

  it('logs the dev server URL once it starts listening', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const configureServer = plugin.configureServer as ConfigureServerHook;
    let listeningCallback: (() => void) | undefined;

    config({}, { command: 'serve' });
    configureServer({
      config: { server: { https: false, port: 5173 } },
      httpServer: {
        address: () => ({ port: 5174 }),
        once: (event, cb) => {
          if (event === 'listening') {
            listeningCallback = cb;
          }
        },
      },
    });
    listeningCallback?.();

    expect(logSpy).toHaveBeenCalledWith('vite-plugin-terse-log → http://localhost:5174');
  });

  it('uses https when the server is configured for it', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const configureServer = plugin.configureServer as ConfigureServerHook;
    let listeningCallback: (() => void) | undefined;

    config({}, { command: 'serve' });
    configureServer({
      config: { server: { https: true, port: 5173 } },
      httpServer: {
        address: () => ({ port: 5174 }),
        once: (event, cb) => {
          if (event === 'listening') {
            listeningCallback = cb;
          }
        },
      },
    });
    listeningCallback?.();

    expect(logSpy).toHaveBeenCalledWith('vite-plugin-terse-log → https://localhost:5174');
  });

  it('falls back to the configured port when the address is unavailable', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const configureServer = plugin.configureServer as ConfigureServerHook;
    let listeningCallback: (() => void) | undefined;

    config({}, { command: 'serve' });
    configureServer({
      config: { server: { https: false, port: 5173 } },
      httpServer: {
        address: () => null,
        once: (event, cb) => {
          if (event === 'listening') {
            listeningCallback = cb;
          }
        },
      },
    });
    listeningCallback?.();

    expect(logSpy).toHaveBeenCalledWith('vite-plugin-terse-log → http://localhost:5173');
  });

  it('does not attach a server listener outside serve mode', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const configureServer = plugin.configureServer as ConfigureServerHook;
    const once = vi.fn();

    config({ build: { watch: {} } }, { command: 'build' });
    configureServer({ config: { server: {} }, httpServer: { address: () => null, once } });

    expect(once).not.toHaveBeenCalled();
  });

  it('does nothing when there is no http server', () => {
    const plugin = terseLog();
    const config = plugin.config as ConfigHook;
    const configureServer = plugin.configureServer as ConfigureServerHook;

    config({}, { command: 'serve' });

    expect(() => configureServer({ config: { server: {} }, httpServer: null })).not.toThrow();
  });
});
