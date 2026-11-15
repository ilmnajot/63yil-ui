import { useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { DrawingCanvas } from './DrawingCanvas'
import { evaluateDrawing, type DrawingMode } from './evaluateDrawing'
import type { DrawingResult } from './scoring'
import type { Stroke } from './types'
import type { ActivityProps } from '../types'
import styles from './DrawingActivity.module.css'

interface DrawingActivityProps extends ActivityProps {
  mode: DrawingMode
}

/** Shared screen for the Trace and Write activities; `mode` is the only difference. */
export function DrawingActivity({ letter, mode, onComplete }: DrawingActivityProps) {
  const { t } = useI18n()
  const activity = letter.activities[mode]
  const glyph = letter.forms[activity.form]
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
    if (next.passed) onComplete()
  }

  function handleRestart() {
    setStrokes([])
    setResult(null)
  }

  return (
    <div className={styles.layout}>
      {/* Instructions (and the model letter in Write) come first, so on phones they sit above the canvas. */}
      <div className={styles.prompt}>
        <p className={styles.instructions}>{activity.instructions}</p>
        {mode === 'write' && (
          <figure className={styles.model}>
            <span className={`arabic ${styles.modelGlyph}`} aria-hidden="true">
              {glyph}
            </span>
            <figcaption>{t('drawing.model')}</figcaption>
          </figure>
        )}
      </div>

      <div className={styles.board}>
        <DrawingCanvas
          glyph={glyph}
          showGuide={mode === 'trace'}
          strokes={strokes}
          onStrokesChange={handleStrokesChange}
          disabled={passed}
          label={t(mode === 'trace' ? 'drawing.traceCanvas' : 'drawing.writeCanvas', { name: letter.name })}
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
            <Button variant="secondary" onClick={handleRestart}>
              {t('drawing.again')}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => handleStrokesChange(strokes.slice(0, -1))}
                disabled={strokes.length === 0}
              >
                {t('drawing.undo')}
              </Button>
              <Button variant="ghost" onClick={handleRestart} disabled={strokes.length === 0}>
                {t('drawing.clear')}
              </Button>
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
