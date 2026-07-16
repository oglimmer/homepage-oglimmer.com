import { describe, expect, it, vi } from 'vitest'
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
  it('types out the text one character at a time and calls onDone', async () => {
    const updates: string[] = []
    const onDone = vi.fn()

    await new Promise<void>((resolve) => {
      runTypewriter('Oli', (value) => updates.push(value), {
        speed: 5,
        onDone: () => {
          onDone()
          resolve()
        },
      })
    })

    expect(updates).toEqual(['O', 'Ol', 'Oli'])
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('stops updating after the returned cleanup function is called', async () => {
    const updates: string[] = []

    const stop = runTypewriter('Hello', (value) => updates.push(value), { speed: 5 })

    // Let the first character render, then cancel.
    await new Promise<void>((resolve) => setTimeout(resolve, 8))
    stop()

    const countAfterStop = updates.length
    await new Promise<void>((resolve) => setTimeout(resolve, 40))
    expect(updates.length).toBe(countAfterStop)
    expect(updates).toEqual(['H'])
  })

  it('respects startDelay before beginning', async () => {
    const updates: string[] = []

    runTypewriter('Hi', (value) => updates.push(value), { speed: 5, startDelay: 40 })

    await new Promise<void>((resolve) => setTimeout(resolve, 20))
    expect(updates).toEqual([])

    await new Promise<void>((resolve) => setTimeout(resolve, 40))
    expect(updates).toEqual(['H'])
  })
})
