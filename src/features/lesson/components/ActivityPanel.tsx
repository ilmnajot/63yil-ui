import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { lessonPath } from '@/app/paths'
import { ACTIVITIES } from '@/features/activities/registry'
import { useProgress } from '@/features/progress/ProgressContext'
import { isActivityDone } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { availableActivities, type ActivityType, type Letter, type LetterSummary } from '@/types/letter'
import styles from './ActivityPanel.module.css'

interface ActivityPanelProps {
  letter: Letter
  activity: ActivityType
  /** All letters, in order. */
  alphabet: LetterSummary[]
  /** The next letter in the alphabet, if any. */
  next?: LetterSummary
}

/** Shows the current activity and, once it is done, a button to move on. */
export function ActivityPanel({ letter, activity, alphabet, next }: ActivityPanelProps) {
  const { progress, markDone } = useProgress()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { labelKey, component: Activity } = ACTIVITIES[activity]

  const steps = availableActivities(letter)
  const step = steps.indexOf(activity)
  const nextActivity = steps[step + 1]
  const activityDone = isActivityDone(progress, letter.id, activity)
  const letterDone = steps.every((type) => isActivityDone(progress, letter.id, type))

  const handleComplete = useCallback(() => markDone(letter.id, activity), [markDone, letter.id, activity])

  // After "Next: …" (pressed at the bottom of a long panel), bring the new activity's top into view.
  // Skipped on first render, so opening a lesson doesn't jump past the letter card.
  const panelRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const panel = panelRef.current
    if (panel && panel.getBoundingClientRect().top < 0) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }, [activity])

  return (
    <Card ref={panelRef} className={`${styles.panel} ${styles[activity]}`} aria-labelledby="activity-title">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>{t('panel.kicker')}</p>
          <h2 id="activity-title" className={styles.title}>
            {t('panel.title', { activity: t(labelKey), letter: letter.name })}
          </h2>
        </div>
        <span className={styles.step}>{t('panel.step', { step: step + 1, total: steps.length })}</span>
      </header>

      <ErrorBoundary>
        {/* `key` gives each letter + activity a fresh state (empty canvas, new shuffle, ...). */}
        <Activity key={`${letter.id}-${activity}`} letter={letter} alphabet={alphabet} onComplete={handleComplete} />
      </ErrorBoundary>

      {activityDone && (
        <footer className={styles.footer}>
          {letterDone ? (
            <>
              <p className={styles.celebrate}>{t('panel.letterDone', { name: letter.name })}</p>
              {next && (
                <Button size="lg" onClick={() => navigate(lessonPath(next.id))}>
                  {t('panel.nextLetter', { name: next.name })} <span className="arabic">{next.arabic}</span> →
                </Button>
              )}
            </>
          ) : (
            nextActivity && (
              <Button size="lg" onClick={() => navigate(lessonPath(letter.id, nextActivity))}>
                {t('panel.nextActivity', { activity: t(ACTIVITIES[nextActivity].labelKey) })}
              </Button>
            )
          )}
        </footer>
      )}
    </Card>
  )
}
