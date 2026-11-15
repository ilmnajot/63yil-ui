import { describe, expect, it } from 'vitest'
import { overlapRatio, scoreDrawing, THRESHOLDS } from './scoring'

/** Builds a 1-row mask from a string like "0110". */
const mask = (bits: string) => Uint8Array.from(bits, (bit) => (bit === '1' ? 1 : 0))

describe('overlapRatio', () => {
  it('returns the share of pixels of the first mask that are inside the second', () => {
    expect(overlapRatio(mask('1111'), mask('1100'))).toBe(0.5)
  })

  it('returns 0 for an empty mask instead of dividing by zero', () => {
    expect(overlapRatio(mask('0000'), mask('1111'))).toBe(0)
  })
})

describe('scoreDrawing', () => {
  const glyph = mask('0011110000')
  const glyphZone = mask('0111111000')

  it('reports an empty drawing', () => {
    const empty = mask('0000000000')
    const result = scoreDrawing({ glyph, glyphZone, inkThick: empty, inkThin: empty }, THRESHOLDS.trace)
    expect(result).toMatchObject({ passed: false, hint: 'empty', stars: 0 })
  })

  it('passes with 3 stars when the letter is fully and precisely covered', () => {
    const result = scoreDrawing(
      { glyph, glyphZone, inkThick: mask('0111111000'), inkThin: mask('0011110000') },
      THRESHOLDS.trace,
    )
    expect(result).toMatchObject({ passed: true, stars: 3, hint: 'great', coverage: 1, precision: 1 })
  })

  it('asks to cover more when only part of the letter is drawn', () => {
    const result = scoreDrawing(
      { glyph, glyphZone, inkThick: mask('0011000000'), inkThin: mask('0011000000') },
      THRESHOLDS.trace,
    )
    expect(result).toMatchObject({ passed: false, hint: 'cover-more' })
  })

  it('asks to stay on the lines when scribbling everywhere', () => {
    const result = scoreDrawing(
      { glyph, glyphZone, inkThick: mask('1111111111'), inkThin: mask('1111111111') },
      THRESHOLDS.trace,
    )
    expect(result).toMatchObject({ passed: false, hint: 'stay-on-lines' })
  })
})
