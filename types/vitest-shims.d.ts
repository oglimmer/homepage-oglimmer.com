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
  export const afterEach: (fn: () => void) => void

  interface ExpectMatchers {
    toBe: (expected: unknown) => void
    toEqual: (expected: unknown) => void
    toHaveBeenCalledTimes: (times: number) => void
  }

  export const expect: (actual: unknown) => ExpectMatchers

  interface Mock {
    (...args: unknown[]): unknown
    [key: string]: unknown
  }

  export const vi: {
    fn: (...args: unknown[]) => Mock
    useFakeTimers: () => void
    useRealTimers: () => void
    advanceTimersByTime: (ms: number) => void
  }
}

declare module 'vitest/config' {
  export function defineConfig(config: Record<string, unknown>): Record<string, unknown>
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
}
