import { useState, type ReactNode } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { DrawingCanvas } from './DrawingCanvas'
import { evaluateDrawing, type DrawingMode } from './evaluateDrawing'
import type { DrawingResult } from './scoring'
import type { Stroke } from './types'
import styles from './DrawingExercise.module.css'

export interface DrawingExerciseProps {
  /** What the child must draw (a letter or letter form). */
  glyph: string
  /** `trace` shows a dotted guide; `write` is from memory. */
  mode: DrawingMode
  /** Accessible description of the canvas. */
  label: string
  /** Shown above the canvas on phones and beside it on larger screens (instructions, model, sound…). */
  prompt: ReactNode
  /** Called once when the drawing is checked and passes. */
  onPassed: (result: DrawingResult) => void
  /** Buttons shown after passing. Defaults to "Yana mashq qilish" (clear and draw again). */
  passedActions?: (restart: () => void) => ReactNode
  /** Extra buttons shown while not passed yet, before "Tekshirish" (e.g. "Skip"). */
  extraActions?: ReactNode
}

/**
 * Canvas + Undo / Clear / Check + feedback with stars.
 * Used by the lesson's Trace and Write activities and by the writing practice.
 */
export function DrawingExercise({
  glyph,
  mode,
  label,
  prompt,
  onPassed,
  passedActions,
  extraActions,
}: DrawingExerciseProps) {
  const { t } = useI18n()
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [result, setResult] = useState<DrawingResult | null>(null)
  const passed = result?.passed ?? false

  function handleStrokesChange(next: Stroke[]) {
    setStrokes(next)
    // Old feedback no longer matches the drawing once it changes.
    if (result && !result.passed) setResult(null)
  }

  function handleCheck() {
    const next = evaluateDrawing(glyph, strokes, mode)
    setResult(next)
    if (next.passed) onPassed(next)
  }

  function restart() {
    setStrokes([])
    setResult(null)
  }

  return (
    <div className={styles.layout}>
      {/* The prompt comes first, so on phones it sits above the canvas. */}
      <div className={styles.prompt}>{prompt}</div>

      <div className={styles.board}>
        <DrawingCanvas
          glyph={glyph}
          showGuide={mode === 'trace'}
          strokes={strokes}
          onStrokesChange={handleStrokesChange}
          disabled={passed}
          label={label}
        />
      </div>

      <div className={styles.side}>
        {result && (
          <div className={passed ? styles.success : styles.retry} role="status" aria-live="polite">
            {passed && (
              <span className={styles.stars} aria-label={t('drawing.stars', { stars: result.stars })}>
                {'★'.repeat(result.stars)}
                <span className={styles.starsEmpty}>{'★'.repeat(3 - result.stars)}</span>
              </span>
            )}
            <p>{t(`drawing.${mode}.${result.hint}`)}</p>
          </div>
        )}

        <div className={styles.actions}>
          {passed ? (
            (passedActions?.(restart) ?? (
              <Button variant="secondary" onClick={restart}>
                {t('drawing.again')}
              </Button>
            ))
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => handleStrokesChange(strokes.slice(0, -1))}
                disabled={strokes.length === 0}
              >
                {t('drawing.undo')}
              </Button>
              <Button variant="ghost" onClick={restart} disabled={strokes.length === 0}>
                {t('drawing.clear')}
              </Button>
              {extraActions}
              <Button size="lg" onClick={handleCheck} disabled={strokes.length === 0}>
                {t('drawing.check')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
