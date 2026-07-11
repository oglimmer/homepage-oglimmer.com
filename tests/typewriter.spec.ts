import { describe, expect, it, vi } from 'vitest'
import { runTypewriter, typedSlice } from '../utils/typewriter'

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
})

describe('runTypewriter', () => {
  it('types out the text one character at a time and calls onDone', () => {
    vi.useFakeTimers()
    const updates: string[] = []
    const onDone = vi.fn()

    runTypewriter('Oli', (value) => updates.push(value), { speed: 10, onDone })

    vi.advanceTimersByTime(10)
    expect(updates).toEqual(['O'])

    vi.advanceTimersByTime(10)
    expect(updates).toEqual(['O', 'Ol'])

    vi.advanceTimersByTime(10)
    expect(updates).toEqual(['O', 'Ol', 'Oli'])
    expect(onDone).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('stops updating after the returned cleanup function is called', () => {
    vi.useFakeTimers()
    const updates: string[] = []

    const stop = runTypewriter('Hello', (value) => updates.push(value), { speed: 10 })

    vi.advanceTimersByTime(10)
    expect(updates).toEqual(['H'])

    stop()

    vi.advanceTimersByTime(100)
    expect(updates).toEqual(['H'])

    vi.useRealTimers()
  })

  it('respects startDelay before beginning', () => {
    vi.useFakeTimers()
    const updates: string[] = []

    runTypewriter('Hi', (value) => updates.push(value), { speed: 10, startDelay: 50 })

    vi.advanceTimersByTime(40)
    expect(updates).toEqual([])

    vi.advanceTimersByTime(10)
    expect(updates).toEqual(['H'])

    vi.useRealTimers()
  })
})
