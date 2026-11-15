import { Link } from 'react-router'
import { lessonPath } from '@/app/paths'
import { useI18n } from '@/i18n/useI18n'
import type { Letter, LetterSummary } from '@/types/letter'
import styles from './LessonNav.module.css'

interface LessonNavProps {
  letter: Letter
  previous?: LetterSummary
  next?: LetterSummary
  total: number
}

/** Back to all letters, the lesson position, and links to the previous / next letter. */
export function LessonNav({ letter, previous, next, total }: LessonNavProps) {
  const { t } = useI18n()
  return (
    <nav className={styles.nav} aria-label={t('lesson.nav')}>
      <Link to="/" className={styles.back}>
        {t('lesson.allLetters')}
      </Link>
      <p className={styles.title}>{t('lesson.position', { order: letter.order, total })}</p>
      <div className={styles.arrows}>
        {previous ? (
          <Link to={lessonPath(previous.id)} className={styles.arrow} aria-label={t('lesson.previous', { name: previous.name })}>
            ‹ <span className="arabic">{previous.arabic}</span>
          </Link>
        ) : (
          <span className={styles.placeholder} />
        )}
        {next ? (
          <Link to={lessonPath(next.id)} className={styles.arrow} aria-label={t('lesson.next', { name: next.name })}>
            <span className="arabic">{next.arabic}</span> ›
          </Link>
        ) : (
          <span className={styles.placeholder} />
        )}
      </div>
    </nav>
  )
}
