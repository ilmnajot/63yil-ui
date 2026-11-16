import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '@/i18n/useI18n'
import type { Letter } from '@/types/letter'
import { PracticeItem, type PracticeResult } from './PracticeItem'
import { PracticeSummary } from './PracticeSummary'
import styles from './PracticeSession.module.css'

interface PracticeSessionProps {
  /** The letters to write, in order (may repeat). */
  items: Letter[]
  onAgain: () => void
  /** Shown at the end of the progress bar, e.g. a "Tugatish" link or a "Yopish" button. */
  exit: ReactNode
  /** Extra links/buttons on the summary, next to "Yana mashq qilish". */
  summaryActions?: ReactNode
  /** Inside another card (the lesson): lighter styling, no outer shadow. */
  embedded?: boolean
}

/**
 * Runs one practice session: one letter at a time with a progress bar, then the summary.
 * Used by the writing practice page and, embedded, by the lesson's Write activity.
 */
export function PracticeSession({ items, onAgain, exit, summaryActions, embedded = false }: PracticeSessionProps) {
  const { t } = useI18n()
  const [results, setResults] = useState<PracticeResult[]>([])
  const index = results.length
  const current = items[index]

  // On phones "Keyingisi" sits below the canvas: bring the next letter's prompt back into view.
  const topRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const top = topRef.current
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' })
  }, [index])

  return (
    <div className={styles.session} ref={topRef}>
      {current ? (
        <>
          <div className={styles.bar}>
            <span className={styles.count}>{t('practice.progress', { current: index + 1, total: items.length })}</span>
            <div
              className={styles.track}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={items.length}
              aria-valuenow={index}
            >
              <div className={styles.fill} style={{ width: `${(index / items.length) * 100}%` }} />
            </div>
            {exit}
          </div>

          <PracticeItem
            key={index}
            letter={current}
            isLast={index === items.length - 1}
            embedded={embedded}
            onDone={(result) => setResults((list) => [...list, result])}
          />
        </>
      ) : (
        <PracticeSummary results={results} onAgain={onAgain} actions={summaryActions} embedded={embedded} />
      )}
    </div>
  )
}
