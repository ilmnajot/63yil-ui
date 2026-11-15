import { describe, expect, it } from 'vitest'
import { fitStrokesToBox, maskBounds, strokesBounds } from './geometry'

describe('strokesBounds', () => {
  it('returns null when there is nothing drawn', () => {
    expect(strokesBounds([])).toBeNull()
  })

  it('finds the box around all strokes', () => {
    const box = strokesBounds([
      [{ x: 0.2, y: 0.3 }, { x: 0.4, y: 0.1 }],
      [{ x: 0.6, y: 0.5 }],
    ])
    expect(box).toEqual({ minX: 0.2, minY: 0.1, maxX: 0.6, maxY: 0.5 })
  })
})

describe('fitStrokesToBox', () => {
  it('moves and scales a small drawing into the target box', () => {
    const strokes = [[{ x: 0, y: 0 }, { x: 0.1, y: 0.1 }]]
    const fitted = fitStrokesToBox(strokes, { minX: 0.25, minY: 0.25, maxX: 0.75, maxY: 0.75 })
    expect(fitted[0]![0]!.x).toBeCloseTo(0.25)
    expect(fitted[0]![1]!.y).toBeCloseTo(0.75)
  })

  it('handles a perfectly vertical line (zero width) using its height only', () => {
    const strokes = [[{ x: 0.9, y: 0.4 }, { x: 0.9, y: 0.6 }]]
    const fitted = fitStrokesToBox(strokes, { minX: 0.45, minY: 0.2, maxX: 0.55, maxY: 0.8 })
    expect(fitted[0]![0]).toEqual({ x: 0.5, y: expect.closeTo(0.2) })
    expect(fitted[0]![1]!.y).toBeCloseTo(0.8)
  })
})

describe('maskBounds', () => {
  it('returns the normalized box of the on pixels', () => {
    // 4x4 mask with a 2x2 square in the middle.
    const mask = Uint8Array.from([0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0])
    expect(maskBounds(mask, 4)).toEqual({ minX: 0.25, minY: 0.25, maxX: 0.75, maxY: 0.75 })
  })

  it('returns null for an empty mask', () => {
    expect(maskBounds(new Uint8Array(16), 4)).toBeNull()
  })
})
