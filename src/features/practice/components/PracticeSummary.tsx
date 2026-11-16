import type { ReactNode } from 'react'
import { XP_PER_PRACTICE_LETTER } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import type { PracticeResult } from './PracticeItem'
import styles from './PracticeSummary.module.css'

interface PracticeSummaryProps {
  results: PracticeResult[]
  onAgain: () => void
  /** Extra links/buttons next to "Yana mashq qilish". */
  actions?: ReactNode
  embedded?: boolean
}

/** End of a session: score, XP earned and how each letter went. */
export function PracticeSummary({ results, onAgain, actions, embedded = false }: PracticeSummaryProps) {
  const { t } = useI18n()
  const correct = results.filter((result) => !result.skipped).length
  // Its own page uses the main heading; inside a lesson it is a sub-section.
  const Heading = embedded ? 'h3' : 'h1'

  return (
    <Card className={[styles.summary, embedded && styles.embedded].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <p className={styles.emoji} aria-hidden="true">
          {correct === results.length ? '🏆' : '🎉'}
        </p>
        <Heading className={styles.title}>{t('practice.summaryTitle')}</Heading>
        <p className={styles.score}>{t('practice.summaryScore', { correct, total: results.length })}</p>
        {correct > 0 && <p className={styles.xp}>{t('practice.summaryXp', { xp: correct * XP_PER_PRACTICE_LETTER })}</p>}
      </header>

      <ol className={styles.results} dir="rtl">
        {results.map((result, i) => (
          <li
            key={i}
            dir="ltr"
            className={[styles.result, result.skipped && styles.skipped].filter(Boolean).join(' ')}
            aria-label={
              result.skipped
                ? t('practice.resultSkipped', { name: result.letter.name })
                : t('practice.resultStars', { name: result.letter.name, stars: result.stars })
            }
          >
            <span className={`arabic ${styles.glyph}`} aria-hidden="true">
              {result.letter.forms.isolated}
            </span>
            <span className={styles.stars} aria-hidden="true">
              {result.skipped ? '—' : '★'.repeat(result.stars)}
            </span>
            {result.hintUsed && (
              <span className={styles.hint} title={t('practice.resultHint')} aria-hidden="true">
                💡
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className={styles.actions}>
        <Button size="lg" onClick={onAgain}>
          {t('practice.again')}
        </Button>
        {actions}
      </div>
    </Card>
  )
}
