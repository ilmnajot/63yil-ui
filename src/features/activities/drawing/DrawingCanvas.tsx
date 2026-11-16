import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { paintGlyph, paintStrokes } from './glyphPainter'
import type { Point, Stroke } from './types'
import { useFontReady } from './useFontReady'
import styles from './DrawingCanvas.module.css'

/** Visible ink width, as a share of the canvas size. */
const INK_WIDTH = 0.035
const INK_COLOR = '#0e7c66'
const GUIDE_FILL = 'rgba(14, 124, 102, 0.07)'
const GUIDE_OUTLINE = 'rgba(14, 124, 102, 0.55)'
const GRID_COLOR = 'rgba(31, 42, 42, 0.08)'

interface DrawingCanvasProps {
  /** The letter (or letter form) being practised. */
  glyph: string
  /** Show the dotted model letter to draw over (Trace) or not (Write). */
  showGuide: boolean
  strokes: Stroke[]
  onStrokesChange: (strokes: Stroke[]) => void
  disabled?: boolean
  /** Accessible description of the canvas. */
  label: string
}

/**
 * Square drawing area that works with mouse, finger and stylus (Pointer Events).
 * The parent owns the strokes (controlled component), which makes undo/clear trivial.
 */
export function DrawingCanvas({ glyph, showGuide, strokes, onStrokesChange, disabled, label }: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentStroke = useRef<Stroke | null>(null)
  // Latest strokes, so a new stroke is always added to the newest list even if several
  // strokes end before React re-renders (e.g. very fast taps for the dots of ث).
  const latestStrokes = useRef(strokes)
  useLayoutEffect(() => {
    latestStrokes.current = strokes
  }, [strokes])
  const [size, setSize] = useState(0)
  const fontReady = useFontReady(glyph)

  // Follow the container's size so the canvas stays sharp on any screen (and after rotating a phone).
  // Measured once immediately, because some browsers deliver the first ResizeObserver callback late.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    setSize(Math.floor(container.clientWidth))
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize(Math.floor(entry.contentRect.width))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || size === 0) return

    const ratio = window.devicePixelRatio || 1
    if (canvas.width !== size * ratio) {
      canvas.width = size * ratio
      canvas.height = size * ratio
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, size, size)

    // Faint center cross, like the guide lines in a handwriting notebook.
    ctx.save()
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 1
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    ctx.stroke()
    ctx.restore()

    if (showGuide && fontReady) {
      paintGlyph(ctx, glyph, size, {
        fill: GUIDE_FILL,
        stroke: GUIDE_OUTLINE,
        strokeWidth: 0.006,
        dash: [0.012, 0.012],
      })
    }

    const all = currentStroke.current ? [...strokes, currentStroke.current] : strokes
    paintStrokes(ctx, all, size, INK_WIDTH, INK_COLOR)
  }, [size, strokes, showGuide, glyph, fontReady])

  useEffect(redraw, [redraw])

  function toPoint(event: PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    const clamp = (value: number) => Math.min(1, Math.max(0, value))
    return { x: clamp((event.clientX - rect.left) / rect.width), y: clamp((event.clientY - rect.top) / rect.height) }
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    // Keep receiving moves even if the finger slides off the canvas. Non-essential, so a failure
    // (e.g. the pointer was already released) must not stop the stroke from starting.
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* drawing still works without capture */
    }
    currentStroke.current = [toPoint(event)]
    redraw()
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const stroke = currentStroke.current
    if (!stroke) return
    // Coalesced events give smoother lines on fast pen movement. The list can be missing (older Safari)
    // or empty (synthetic events), so fall back to the event itself.
    const coalesced = event.nativeEvent.getCoalescedEvents?.() ?? []
    const events = coalesced.length > 0 ? coalesced : [event.nativeEvent]
    const rect = event.currentTarget.getBoundingClientRect()
    for (const e of events) {
      stroke.push({
        x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
      })
    }
    redraw()
  }

  function handlePointerEnd() {
    const stroke = currentStroke.current
    if (!stroke) return
    currentStroke.current = null
    const next = [...latestStrokes.current, stroke]
    latestStrokes.current = next
    onStrokesChange(next)
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        className={[styles.canvas, disabled ? styles.disabled : ''].join(' ')}
        style={{ width: size, height: size }}
        role="img"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
    </div>
  )
}
