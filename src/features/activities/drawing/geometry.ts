/** Pure geometry helpers for strokes. No browser APIs, so they are unit-tested. */
import type { Box, Stroke } from './types'

/** The smallest box containing every point, or `null` when there are no points. */
export function strokesBounds(strokes: Stroke[]): Box | null {
  let box: Box | null = null
  for (const stroke of strokes) {
    for (const { x, y } of stroke) {
      box = box
        ? { minX: Math.min(box.minX, x), minY: Math.min(box.minY, y), maxX: Math.max(box.maxX, x), maxY: Math.max(box.maxY, y) }
        : { minX: x, minY: y, maxX: x, maxY: y }
    }
  }
  return box
}

/**
 * Moves and scales strokes so their bounding box fits inside `target`, keeping their proportions.
 * Used by the Write activity: the child can write anywhere and at any size,
 * and their drawing is lined up with the model letter before comparing.
 */
export function fitStrokesToBox(strokes: Stroke[], target: Box): Stroke[] {
  const source = strokesBounds(strokes)
  if (!source) return strokes

  const sourceW = source.maxX - source.minX
  const sourceH = source.maxY - source.minY
  const targetW = target.maxX - target.minX
  const targetH = target.maxY - target.minY

  // A perfectly straight line has zero width (or height): only the other axis decides the scale.
  const MIN_SPAN = 1e-3
  const scales = [
    sourceW > MIN_SPAN ? targetW / sourceW : Infinity,
    sourceH > MIN_SPAN ? targetH / sourceH : Infinity,
  ]
  const scale = Math.min(...scales)
  const safeScale = Number.isFinite(scale) ? scale : 1

  const sourceCx = (source.minX + source.maxX) / 2
  const sourceCy = (source.minY + source.maxY) / 2
  const targetCx = (target.minX + target.maxX) / 2
  const targetCy = (target.minY + target.maxY) / 2

  return strokes.map((stroke) =>
    stroke.map(({ x, y }) => ({
      x: targetCx + (x - sourceCx) * safeScale,
      y: targetCy + (y - sourceCy) * safeScale,
    })),
  )
}

/** Bounding box of the "on" pixels of a square mask, in normalized coordinates. */
export function maskBounds(mask: Uint8Array, size: number): Box | null {
  let minX = size
  let minY = size
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!mask[y * size + x]) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  if (maxX < 0) return null
  return { minX: minX / size, minY: minY / size, maxX: (maxX + 1) / size, maxY: (maxY + 1) / size }
}
