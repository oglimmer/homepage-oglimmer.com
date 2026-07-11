export interface TypewriterOptions {
  speed?: number
  startDelay?: number
  onDone?: () => void
}

/**
 * Returns the first `count` characters of `text`, clamped to a sane range
 * so callers never have to worry about negative or out-of-bounds counts.
 */
export function typedSlice(text: string, count: number): string {
  const clamped = Math.max(0, Math.min(count, text.length))
  return text.slice(0, clamped)
}

/**
 * Reveals `text` one character at a time via `onUpdate`, after an optional
 * `startDelay`. Returns a cleanup function that stops any pending timers,
 * safe to call multiple times (e.g. from onBeforeUnmount).
 */
export function runTypewriter(
  text: string,
  onUpdate: (value: string) => void,
  options: TypewriterOptions = {},
): () => void {
  const { speed = 55, startDelay = 0, onDone } = options
  let index = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let cancelled = false

  function step() {
    if (cancelled) return
    index += 1
    onUpdate(typedSlice(text, index))
    if (index < text.length) {
      timeoutId = setTimeout(step, speed)
    }
    else {
      onDone?.()
    }
  }

  timeoutId = setTimeout(step, startDelay)

  return () => {
    cancelled = true
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
}
