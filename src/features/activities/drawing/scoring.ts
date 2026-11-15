/**
 * Decides whether a drawing matches the letter. Pure functions, unit-tested.
 *
 * Every input is a square black/white mask (1 = pixel is "on"):
 * - `glyph`: the letter itself
 * - `glyphZone`: the letter made a bit thicker, the area where ink is allowed
 * - `inkThick`: the child's strokes drawn thick, to measure what they covered
 * - `inkThin`: the child's strokes drawn thin, to measure where they actually drew
 *
 * Two numbers come out of it:
 * - coverage: how much of the letter the child went over
 * - precision: how much of the child's ink stayed on the letter
 * Both are needed: scribbling everywhere gives high coverage but low precision,
 * and one small correct line gives high precision but low coverage.
 */

export interface DrawingMasks {
  glyph: Uint8Array
  glyphZone: Uint8Array
  inkThick: Uint8Array
  inkThin: Uint8Array
}

export interface Thresholds {
  minCoverage: number
  minPrecision: number
}

/** Trace has the guide on screen, so it is stricter than Write (drawn from memory). */
export const THRESHOLDS = {
  trace: { minCoverage: 0.7, minPrecision: 0.75 },
  write: { minCoverage: 0.55, minPrecision: 0.6 },
} as const satisfies Record<string, Thresholds>

export type DrawingHint = 'great' | 'empty' | 'cover-more' | 'stay-on-lines'

export interface DrawingResult {
  coverage: number
  precision: number
  passed: boolean
  /** 0 when failed, otherwise 1–3. */
  stars: 0 | 1 | 2 | 3
  hint: DrawingHint
}

/** Share of the "on" pixels of `of` that are also "on" in `within`. Returns 0 for an empty `of`. */
export function overlapRatio(of: Uint8Array, within: Uint8Array): number {
  let total = 0
  let inside = 0
  for (let i = 0; i < of.length; i++) {
    if (!of[i]) continue
    total++
    if (within[i]) inside++
  }
  return total === 0 ? 0 : inside / total
}

export function scoreDrawing(masks: DrawingMasks, thresholds: Thresholds): DrawingResult {
  const hasInk = masks.inkThin.some(Boolean)
  if (!hasInk) return { coverage: 0, precision: 0, passed: false, stars: 0, hint: 'empty' }

  const coverage = overlapRatio(masks.glyph, masks.inkThick)
  const precision = overlapRatio(masks.inkThin, masks.glyphZone)
  const passed = coverage >= thresholds.minCoverage && precision >= thresholds.minPrecision

  if (!passed) {
    // Point the child at whichever number is furthest below its threshold.
    const coverageGap = thresholds.minCoverage - coverage
    const precisionGap = thresholds.minPrecision - precision
    return { coverage, precision, passed, stars: 0, hint: coverageGap >= precisionGap ? 'cover-more' : 'stay-on-lines' }
  }

  const score = (coverage + precision) / 2
  const stars = score >= 0.9 ? 3 : score >= 0.8 ? 2 : 1
  return { coverage, precision, passed, stars, hint: 'great' }
}
