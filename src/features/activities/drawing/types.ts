/**
 * A point on the drawing area, in *normalized* coordinates:
 * (0, 0) is the top-left corner and (1, 1) the bottom-right, whatever the size on screen.
 * This keeps drawings independent of screen size and pixel density.
 */
export interface Point {
  x: number
  y: number
}

/** One continuous line, from finger/pen down to up. */
export type Stroke = Point[]

/** Axis-aligned rectangle in normalized coordinates. */
export interface Box {
  minX: number
  minY: number
  maxX: number
  maxY: number
}
