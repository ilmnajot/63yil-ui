/**
 * Writing practice: which letters, how many, and the random order they come in.
 * Pure functions (no React, no browser), so they are unit-tested in `practiceSettings.test.ts`.
 */
import type { LetterSummary } from '@/types/letter'

/** Which letters a practice session draws from. */
export type LetterSet = 'learned' | 'all' | 'range'

/** How many letters one session asks for. */
export const PRACTICE_SIZES = [5, 10, 20] as const
export type PracticeSize = (typeof PRACTICE_SIZES)[number]

/** A practice session needs at least this many different letters to be a real "mix". */
export const MIN_LETTERS = 2

export interface PracticeSettings {
  set: LetterSet
  /** Alphabet positions (1–28), used when `set` is `range`. Inclusive. */
  from: number
  to: number
  count: PracticeSize
}

export const DEFAULT_SETTINGS: PracticeSettings = { set: 'all', from: 1, to: 28, count: 10 }

/**
 * Reads settings from the URL (`?set=range&from=11&to=23&count=10`), so a session can be linked to
 * and survives a page reload. Anything missing or invalid falls back to the defaults.
 */
export function parseSettings(params: URLSearchParams, alphabetSize: number): PracticeSettings {
  const set = params.get('set')
  const count = Number(params.get('count'))
  const clamp = (value: number, fallback: number) =>
    Number.isInteger(value) && value >= 1 && value <= alphabetSize ? value : fallback

  let from = clamp(Number(params.get('from')), 1)
  let to = clamp(Number(params.get('to')), alphabetSize)
  if (from > to) [from, to] = [to, from]

  return {
    set: set === 'learned' || set === 'range' ? set : 'all',
    from,
    to,
    count: (PRACTICE_SIZES as readonly number[]).includes(count) ? (count as PracticeSize) : DEFAULT_SETTINGS.count,
  }
}

export function settingsToParams(settings: PracticeSettings): URLSearchParams {
  const params = new URLSearchParams({ set: settings.set, count: String(settings.count) })
  if (settings.set === 'range') {
    params.set('from', String(settings.from))
    params.set('to', String(settings.to))
  }
  return params
}

/** The letters a session may use, given the settings and which letters the child has learned. */
export function pickPool(
  letters: LetterSummary[],
  settings: PracticeSettings,
  learnedIds: ReadonlySet<number>,
): LetterSummary[] {
  switch (settings.set) {
    case 'learned':
      return letters.filter((letter) => learnedIds.has(letter.id))
    case 'range':
      return letters.filter((letter) => letter.order >= settings.from && letter.order <= settings.to)
    case 'all':
      return letters
  }
}

/**
 * The order of letters for one session.
 * - Every letter of the pool appears before any letter repeats (when `count` ≥ pool size),
 *   so a range is fully covered.
 * - The same letter never comes twice in a row.
 * @param random - source of randomness in [0, 1); injectable so tests are predictable
 */
export function buildQueue<T extends { id: number }>(pool: T[], count: number, random: () => number = Math.random): T[] {
  if (pool.length === 0 || count <= 0) return []
  if (pool.length === 1) return Array.from({ length: count }, () => pool[0]!)

  const queue: T[] = []
  while (queue.length < count) {
    const round = shuffle(pool, random)
    // Avoid a repeat across the boundary between two rounds.
    if (round[0]!.id === queue.at(-1)?.id) round.push(round.shift()!)
    queue.push(...round)
  }
  return queue.slice(0, count)
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
