/**
 * Turns a drawing into masks (using hidden canvases) and scores it.
 * This is the bridge between the browser canvas and the pure logic in `scoring.ts`.
 */
import { fitStrokesToBox, maskBounds } from './geometry'
import { paintGlyph, paintStrokes } from './glyphPainter'
import { scoreDrawing, THRESHOLDS, type DrawingResult } from './scoring'
import type { Stroke } from './types'

/** Resolution of the hidden scoring canvases. Small is fast and forgiving enough. */
const ANALYSIS_SIZE = 160

/** Line widths, as a share of the canvas size. */
const ZONE_EXTRA_WIDTH = 0.08
const INK_THICK_WIDTH = 0.12
const INK_THIN_WIDTH = 0.02

function renderMask(paint: (ctx: CanvasRenderingContext2D) => void): Uint8Array {
  const canvas = document.createElement('canvas')
  canvas.width = ANALYSIS_SIZE
  canvas.height = ANALYSIS_SIZE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  paint(ctx)
  const { data } = ctx.getImageData(0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE)
  const mask = new Uint8Array(ANALYSIS_SIZE * ANALYSIS_SIZE)
  // A pixel is "on" when it is mostly opaque (alpha channel is every 4th byte).
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3]! > 127 ? 1 : 0
  return mask
}

export type DrawingMode = keyof typeof THRESHOLDS

export function evaluateDrawing(glyph: string, strokes: Stroke[], mode: DrawingMode): DrawingResult {
  const size = ANALYSIS_SIZE
  const glyphMask = renderMask((ctx) => paintGlyph(ctx, glyph, size, { fill: '#000' }))
  const glyphZone = renderMask((ctx) =>
    paintGlyph(ctx, glyph, size, { fill: '#000', stroke: '#000', strokeWidth: ZONE_EXTRA_WIDTH }),
  )

  // In Write mode the child may draw anywhere, at any size: line their drawing up with the model first.
  const glyphBox = maskBounds(glyphMask, size)
  const aligned = mode === 'write' && glyphBox ? fitStrokesToBox(strokes, glyphBox) : strokes

  const inkThick = renderMask((ctx) => paintStrokes(ctx, aligned, size, INK_THICK_WIDTH, '#000'))
  const inkThin = renderMask((ctx) => paintStrokes(ctx, aligned, size, INK_THIN_WIDTH, '#000'))

  return scoreDrawing({ glyph: glyphMask, glyphZone, inkThick, inkThin }, THRESHOLDS[mode])
}
