# @nl-design-system-community/vite-plugin-terse-log

A Vite plugin that quiets `vite`'s dev-server and `vite build --watch` output down to a
single line per package: the package name plus either its dev server URL or a
"done building" message.

## Why

This monorepo starts every package's dev server at once with
`pnpm --recursive --parallel run dev`. With N packages all printing Vite's default
"VITE vX ready in Xms" banners, "watching for file changes..." lines, and rebuild
notices, the combined output is hard to scan for the one thing you actually want:
is this package ready, and where do I find it?

`terseLog()` drops the noise and prints exactly one line per package instead:

```text
css-scraper → http://localhost:5173
clippy-components done building
```

## When not to use this

- **Plain `vite build`** (a one-off production build, not `--watch`) is left
  completely untouched on purpose — you still want the full rollup/dts output
  there to debug bundle size, warnings, etc.
- If you want to see the normal Vite startup banner, rebuild timings, or other
  `info`-level logging while developing a single package in isolation, skip this
  plugin — it sets `logLevel: 'error'` for `serve` and watch builds, so only
  actual errors get through in those modes.
- It doesn't help with non-Vite dev servers (Astro, Storybook, etc.) — those
  don't expose an equivalent hook to swap in a custom logger without patching
  their internals, so this plugin only covers packages that run Vite directly.

## Install

```sh
pnpm add -D @nl-design-system-community/vite-plugin-terse-log
```

## Usage

Add it to a package's `vite.config.ts`/`.js` `plugins` array — order doesn't
matter relative to other plugins:

```ts
import { terseLog } from '@nl-design-system-community/vite-plugin-terse-log';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [terseLog()],
});
```

The label is read from the consuming package's own `package.json` `name` field
(with the npm scope stripped), so there's nothing to configure.

Behavior by command:

| Command                 | Output                                                             |
| ----------------------- | ------------------------------------------------------------------ |
| `vite` (dev server)     | `<package> → http://localhost:<port>` once the server is listening |
| `vite build --watch`    | `<package> done building` after every (re)build                    |
| `vite build` (no watch) | Untouched — full default build output                              |

## Testing

The plugin's hooks (`config`, `configureServer`, `closeBundle`) are plain
functions, so they're tested directly with `vitest` — no real Vite server or
build needed. See [`src/index.test.ts`](./src/index.test.ts) for examples, e.g.
calling `config()` with a fake `ConfigEnv` and asserting the returned
`logLevel`, or invoking `configureServer()` with a stub `httpServer` to check
the printed URL.

```sh
pnpm run test-build
```
