/**
 * Minimal ambient shims so `nuxi typecheck` can resolve the modules used by
 * vitest.config.ts and tests/*.spec.ts even in environments where the
 * `vitest` package (and its bundled types) or `@types/node` aren't
 * installed. These are intentionally loose (no real type-checking of
 * vitest's API) — they only exist to satisfy module resolution.
 */
declare module 'vitest' {
  export const describe: (name: string, fn: () => void) => void
  export const it: (name: string, fn: () => void | Promise<void>) => void
  export const expect: any
  export const vi: any
}

declare module 'vitest/config' {
  export function defineConfig(config: any): any
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
}
