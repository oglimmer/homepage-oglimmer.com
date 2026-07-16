import { describe, expect, it, vi, afterEach } from 'vitest'
import { runTypewriter, typedSlice } from '../utils/typewriter'

// `typedSlice` is the core of the typing effect and is what the hero page uses
// (both directly and via `runTypewriter`) to reveal the greeting one letter at
// a time. These assertions capture the exact sequence the animation produces.
describe('typedSlice', () => {
  it('returns a prefix of the given length', () => {
    expect(typedSlice('hello', 3)).toBe('hel')
  })

  it('clamps to the full string when count exceeds length', () => {
    expect(typedSlice('hi', 10)).toBe('hi')
  })

  it('returns an empty string for zero or negative counts', () => {
    expect(typedSlice('hello', 0)).toBe('')
    expect(typedSlice('hello', -5)).toBe('')
  })

  it('produces the frame-by-frame sequence used by the hero typing effect', () => {
    const name = "Hi, I'm Oli."
    const frames = Array.from({ length: name.length + 1 }, (_, i) => typedSlice(name, i))
    expect(frames).toEqual(['', 'H', 'Hi', 'Hi,', 'Hi, ', "Hi, I", "Hi, I'", "Hi, I'm", "Hi, I'm ", "Hi, I'm O", "Hi, I'm Ol", "Hi, I'm Oli", "Hi, I'm Oli."])
  })
})

describe('runTypewriter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('types out the text one character at a time and calls onDone', () => {
    vi.useFakeTimers()
    const updates: string[] = []
    const onDone = vi.fn()

    runTypewriter('Oli', (value) => updates.push(value), {
      speed: 5,
      onDone: () => {
        onDone()
      },
    })

    // startDelay defaults to 0, so the first character fires at time 0.
    vi.advanceTimersByTime(1)
    expect(updates).toEqual(['O'])

    vi.advanceTimersByTime(5)
    expect(updates).toEqual(['O', 'Ol'])

    vi.advanceTimersByTime(5)
    expect(updates).toEqual(['O', 'Ol', 'Oli'])
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('stops updating after the returned cleanup function is called', () => {
    vi.useFakeTimers()
    const updates: string[] = []

    const stop = runTypewriter('Hello', (value) => updates.push(value), { speed: 5 })

    // Let the first character render, then cancel.
    vi.advanceTimersByTime(1)
    expect(updates).toEqual(['H'])
    stop()

    // Advance well past the next tick — no more updates should fire.
    vi.advanceTimersByTime(100)
    expect(updates).toEqual(['H'])
  })

  it('respects startDelay before beginning', () => {
    vi.useFakeTimers()
    const updates: string[] = []

    runTypewriter('Hi', (value) => updates.push(value), { speed: 5, startDelay: 40 })

    // At 20 ms the startDelay has not elapsed yet.
    vi.advanceTimersByTime(20)
    expect(updates).toEqual([])

    // Advance past the 40 ms startDelay — the first character should fire.
    vi.advanceTimersByTime(21)
    expect(updates).toEqual(['H'])
  })
})
