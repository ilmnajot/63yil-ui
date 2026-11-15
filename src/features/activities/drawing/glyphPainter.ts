/**
 * Draws a letter and strokes onto a <canvas>. Shared by the on-screen canvas
 * and by the hidden canvases used for scoring, so both always line up exactly.
 */
import type { Stroke } from './types'

/** Font used for the model letter. Must match the font loaded in `index.html`. */
export const GLYPH_FONT_FAMILY = 'Amiri'

/** The letter fills at most this share of the drawing area, leaving a margin. */
const GLYPH_MAX_SHARE = 0.72

const MEASURE_FONT_SIZE = 100

interface GlyphLayout {
  font: string
  x: number
  y: number
}

/**
 * Works out the font size and position that center `glyph` in a `size`×`size` square.
 * Uses the real ink bounds of the glyph, because Arabic letters sit at very different heights.
 */
function layoutGlyph(ctx: CanvasRenderingContext2D, glyph: string, size: number): GlyphLayout {
  ctx.save()
  ctx.font = `${MEASURE_FONT_SIZE}px ${GLYPH_FONT_FAMILY}`
  ctx.direction = 'rtl'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const m = ctx.measureText(glyph)
  ctx.restore()

  const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight || MEASURE_FONT_SIZE / 2
  const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || MEASURE_FONT_SIZE
  const scale = Math.min((GLYPH_MAX_SHARE * size) / width, (GLYPH_MAX_SHARE * size) / height)

  // Position the text anchor so the middle of the ink lands in the middle of the square.
  const x = size / 2 - ((m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2) * scale
  const y = size / 2 - ((m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2) * scale
  return { font: `${MEASURE_FONT_SIZE * scale}px ${GLYPH_FONT_FAMILY}`, x, y }
}

export interface GlyphStyle {
  fill?: string
  /** Outline color; omitted = no outline. */
  stroke?: string
  /** Outline width as a share of the canvas size. */
  strokeWidth?: number
  /** Dash pattern as shares of the canvas size, e.g. [0.01, 0.012] for a dotted outline. */
  dash?: number[]
}

export function paintGlyph(ctx: CanvasRenderingContext2D, glyph: string, size: number, style: GlyphStyle): void {
  const { font, x, y } = layoutGlyph(ctx, glyph, size)
  ctx.save()
  ctx.font = font
  ctx.direction = 'rtl'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  if (style.fill) {
    ctx.fillStyle = style.fill
    ctx.fillText(glyph, x, y)
  }
  if (style.stroke) {
    ctx.strokeStyle = style.stroke
    ctx.lineWidth = (style.strokeWidth ?? 0.01) * size
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.setLineDash((style.dash ?? []).map((part) => part * size))
    ctx.strokeText(glyph, x, y)
  }
  ctx.restore()
}

/**
 * Draws strokes given in normalized coordinates.
 * @param widthShare - line width as a share of the canvas size
 */
export function paintStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  size: number,
  widthShare: number,
  color: string,
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = widthShare * size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const stroke of strokes) {
    const [first, ...rest] = stroke
    if (!first) continue
    if (rest.length === 0) {
      // A single tap (e.g. the dot of ب) becomes a round dot.
      ctx.beginPath()
      ctx.arc(first.x * size, first.y * size, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fill()
      continue
    }
    ctx.beginPath()
    ctx.moveTo(first.x * size, first.y * size)
    for (const point of rest) ctx.lineTo(point.x * size, point.y * size)
    ctx.stroke()
  }
  ctx.restore()
}
