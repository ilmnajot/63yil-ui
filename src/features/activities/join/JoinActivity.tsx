import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import type { ActivityProps } from '../types'
import { DrillItem, type DrillResult } from './DrillItem'
import styles from './JoinActivity.module.css'

/**
 * Join ("Birikma"): the lesson's Qaida-style drills, one by one: trace each, then write it.
 * The step counts as done when the child reaches the end (skipped drills allowed).
 */
export function JoinActivity({ letter, onComplete }: ActivityProps) {
  const { t } = useI18n()
  const drills = letter.activities.join?.drills ?? []
  const [results, setResults] = useState<DrillResult[]>([])
  const [round, setRound] = useState(0)
  const current = drills[results.length]

  // Bring the next drill back into view after "Keyingi birikma" (pressed at the bottom on phones).
  const topRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const top = topRef.current
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' })
  }, [results.length])

  function handleDone(result: DrillResult) {
    const next = [...results, result]
    setResults(next)
    if (next.length === drills.length) onComplete()
  }

  if (drills.length === 0) return <p>{t('join.empty')}</p>

  if (!current) {
    const correct = results.filter((result) => !result.skipped).length
    return (
      <div className={styles.summary}>
        <p className={styles.summaryTitle}>🎉 {t('join.summaryTitle')}</p>
        <p>{t('join.summaryScore', { correct, total: drills.length })}</p>
        <ol className={styles.results}>
          {results.map((result) => (
            <li key={result.drill.id} className={result.skipped ? styles.skipped : styles.result}>
              <span className="arabic" lang="ar">
                {result.drill.text}
              </span>
              <span className={styles.stars}>{result.skipped ? '—' : '★'.repeat(result.stars)}</span>
            </li>
          ))}
        </ol>
        <Button
          variant="secondary"
          onClick={() => {
            setResults([])
            setRound((n) => n + 1)
          }}
        >
          {t('join.restart')}
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.join} ref={topRef}>
      <p className={styles.instructions}>{letter.activities.join?.instructions}</p>
      <div className={styles.bar}>
        <span className={styles.count}>{t('practice.progress', { current: results.length + 1, total: drills.length })}</span>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={drills.length}
          aria-valuenow={results.length}
        >
          <div className={styles.fill} style={{ width: `${(results.length / drills.length) * 100}%` }} />
        </div>
      </div>
      <DrillItem
        key={`${round}-${current.id}`}
        drill={current}
        isLast={results.length === drills.length - 1}
        onDone={handleDone}
      />
    </div>
  )
}
