import { useState } from 'react'
import { Link } from 'react-router'
import { lettersApi } from '@/api/lettersApi'
import { practicePlayPath } from '@/app/paths'
import { describeError } from '@/i18n/describeError'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { ErrorMessage, Loading } from '@/shared/components/StatusMessage'
import { useAsync } from '@/shared/hooks/useAsync'
import type { Letter, LetterSummary } from '@/types/letter'
import { PracticeSession } from './components/PracticeSession'
import { buildQueue } from './practiceSettings'
import styles from './LessonReview.module.css'

/** How many letters one review round asks for. */
export const REVIEW_SIZE = 5

interface LessonReviewProps {
  /** The lesson's letter; the review mixes it with every letter before it. */
  letter: Letter
  alphabet: LetterSummary[]
}

/**
 * A short writing review inside the lesson: letters 1…current, mixed, written from memory.
 * Starts only when the child presses "Boshlash", so nothing is loaded until then.
 * Not shown for the first letter (there is nothing to review yet).
 */
export function LessonReview({ letter, alphabet }: LessonReviewProps) {
  const { t } = useI18n()
  const [round, setRound] = useState(0) // 0 = not started

  const pool = alphabet.filter((item) => item.order <= letter.order)
  if (pool.length < 2) return null

  return (
    <section className={styles.review} aria-labelledby="review-title">
      {round === 0 ? (
        <div className={styles.intro}>
          <div className={styles.text}>
            <h3 id="review-title" className={styles.title}>
              {t('review.title')}
            </h3>
            <p>{t('review.text', { from: 1, to: letter.order, count: REVIEW_SIZE })}</p>
            {/* The letters in play, right to left like the alphabet. */}
            <p className={`arabic ${styles.letters}`} aria-hidden="true">
              {pool.map((item) => item.arabic).join(' ')}
            </p>
          </div>
          <Button size="lg" onClick={() => setRound(1)}>
            {t('review.start')}
          </Button>
        </div>
      ) : (
        <>
          <h3 id="review-title" className="visually-hidden">
            {t('review.title')}
          </h3>
          <ReviewRound
            key={round}
            letter={letter}
            pool={pool}
            onAgain={() => setRound((n) => n + 1)}
            onClose={() => setRound(0)}
          />
        </>
      )}
    </section>
  )
}

interface ReviewRoundProps {
  letter: Letter
  pool: LetterSummary[]
  onAgain: () => void
  onClose: () => void
}

/** One round: picks the letters, loads their details (for the sound), then runs the session. */
function ReviewRound({ letter, pool, onAgain, onClose }: ReviewRoundProps) {
  const { t } = useI18n()
  const items = useAsync(async (signal) => {
    const queue = buildQueue(pool, REVIEW_SIZE)
    // The lesson's own letter is already loaded; fetch only the others.
    const otherIds = [...new Set(queue.map((item) => item.id))].filter((id) => id !== letter.id)
    const loaded = await Promise.all(otherIds.map((id) => lettersApi.get(id, signal)))
    const byId = new Map([letter, ...loaded].map((item) => [item.id, item]))
    return queue.map((item) => byId.get(item.id)!)
  }, [])

  if (items.status === 'loading') return <Loading label={t('practice.loading')} />
  if (items.status === 'error') return <ErrorMessage message={describeError(items.error, t)} onRetry={items.retry} />

  return (
    <PracticeSession
      embedded
      items={items.data}
      onAgain={onAgain}
      exit={
        <button type="button" onClick={onClose}>
          {t('review.close')}
        </button>
      }
      summaryActions={
        <Link to={practicePlayPath({ set: 'range', from: 1, to: letter.order, count: 10 })}>{t('review.more')}</Link>
      }
    />
  )
}
