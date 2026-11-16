import { useI18n } from '@/i18n/useI18n'
import type { ActivityProps } from '../types'
import { DrawingExercise } from './DrawingExercise'
import type { DrawingMode } from './evaluateDrawing'
import styles from './DrawingExercise.module.css'

interface DrawingActivityProps extends ActivityProps {
  mode: DrawingMode
}

/** The lesson's Trace and Write activities; `mode` is the only difference. */
export function DrawingActivity({ letter, mode, onComplete }: DrawingActivityProps) {
  const { t } = useI18n()
  const activity = letter.activities[mode]
  const glyph = letter.forms[activity.form]

  return (
    <DrawingExercise
      glyph={glyph}
      mode={mode}
      label={t(mode === 'trace' ? 'drawing.traceCanvas' : 'drawing.writeCanvas', { name: letter.name })}
      onPassed={onComplete}
      prompt={
        <>
          <p className={styles.instructions}>{activity.instructions}</p>
          {mode === 'write' && (
            <figure className={styles.model}>
              <span className={`arabic ${styles.modelGlyph}`} aria-hidden="true">
                {glyph}
              </span>
              <figcaption>{t('drawing.model')}</figcaption>
            </figure>
          )}
        </>
      }
    />
  )
}
