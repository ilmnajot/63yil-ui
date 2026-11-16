import { describe, expect, it } from 'vitest'
import { buildQueue, DEFAULT_SETTINGS, parseSettings, pickPool, settingsToParams } from './practiceSettings'

const letters = Array.from({ length: 28 }, (_, i) => ({ id: i + 1, order: i + 1, name: `L${i + 1}`, arabic: 'x' }))

/** Small deterministic random generator so tests don't depend on luck. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

describe('parseSettings', () => {
  it('reads a range from the URL', () => {
    const settings = parseSettings(new URLSearchParams('set=range&from=11&to=23&count=20'), 28)
    expect(settings).toEqual({ set: 'range', from: 11, to: 23, count: 20 })
  })

  it('swaps a reversed range and falls back on invalid values', () => {
    expect(parseSettings(new URLSearchParams('set=range&from=23&to=11'), 28)).toMatchObject({ from: 11, to: 23 })
    expect(parseSettings(new URLSearchParams('set=nope&from=0&to=99&count=7'), 28)).toEqual(DEFAULT_SETTINGS)
  })

  it('round-trips through the URL', () => {
    const settings = { set: 'range', from: 3, to: 9, count: 5 } as const
    expect(parseSettings(settingsToParams(settings), 28)).toEqual(settings)
  })
})

describe('pickPool', () => {
  it('picks a range by alphabet position', () => {
    const pool = pickPool(letters, { set: 'range', from: 11, to: 23, count: 10 }, new Set())
    expect(pool.map((l) => l.order)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
  })

  it('picks only learned letters', () => {
    expect(pickPool(letters, { ...DEFAULT_SETTINGS, set: 'learned' }, new Set([2, 5])).map((l) => l.id)).toEqual([2, 5])
  })
})

describe('buildQueue', () => {
  it('returns exactly `count` letters from the pool', () => {
    const pool = letters.slice(10, 23)
    const queue = buildQueue(pool, 20, seeded(1))
    expect(queue).toHaveLength(20)
    expect(queue.every((l) => pool.includes(l))).toBe(true)
  })

  it('shows every letter of the range before repeating any', () => {
    const pool = letters.slice(10, 23) // 13 letters
    const queue = buildQueue(pool, 20, seeded(2))
    expect(new Set(queue.slice(0, 13).map((l) => l.id)).size).toBe(13)
  })

  it('never puts the same letter twice in a row', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const queue = buildQueue(letters.slice(0, 2), 20, seeded(seed))
      queue.forEach((letter, i) => i > 0 && expect(letter.id).not.toBe(queue[i - 1]!.id))
    }
  })

  it('handles tiny pools', () => {
    expect(buildQueue([], 10)).toEqual([])
    expect(buildQueue([letters[0]!], 3)).toHaveLength(3)
  })
})
