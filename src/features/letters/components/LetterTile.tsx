import { Link } from 'react-router'
import { ACTIVITIES } from '@/features/activities/registry'
import { useProgress } from '@/features/progress/ProgressContext'
import { isActivityDone, isLetterDone } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { ACTIVITY_TYPES, type LetterSummary } from '@/types/letter'
import { lessonPath } from '@/app/paths'
import styles from './LetterTile.module.css'

interface LetterTileProps {
  letter: LetterSummary
}

/** One letter on the home page, with four dots showing which activities are done. */
export function LetterTile({ letter }: LetterTileProps) {
  const { progress } = useProgress()
  const { t } = useI18n()
  const complete = isLetterDone(progress, letter.id)
  const doneCount = ACTIVITY_TYPES.filter((type) => isActivityDone(progress, letter.id, type)).length

  return (
    <Link
      to={lessonPath(letter.id)}
      className={[styles.tile, complete && styles.complete].filter(Boolean).join(' ')}
      aria-label={t('letters.tileLabel', {
        order: letter.order,
        name: letter.name,
        done: doneCount,
        total: ACTIVITY_TYPES.length,
      })}
    >
      <span className={styles.order}>{letter.order}</span>
      {complete && (
        <span className={styles.badge} aria-hidden="true">
          ✓
        </span>
      )}
      <span className={`arabic ${styles.glyph}`} aria-hidden="true">
        {letter.arabic}
      </span>
      <span className={styles.name}>{letter.name}</span>
      <span className={styles.dots} aria-hidden="true">
        {ACTIVITY_TYPES.map((type) => (
          <span
            key={type}
            title={t(ACTIVITIES[type].labelKey)}
            className={[styles.dot, isActivityDone(progress, letter.id, type) && styles[type]].filter(Boolean).join(' ')}
          />
        ))}
      </span>
    </Link>
  )
}
