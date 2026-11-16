import { useEffect, useState } from 'react'
import { DrawingExercise } from '@/features/activities/drawing/DrawingExercise'
import type { DrawingResult } from '@/features/activities/drawing/scoring'
import { SoundButtons } from '@/features/activities/shared/SoundButtons'
import { useProgress } from '@/features/progress/ProgressContext'
import { XP_PER_PRACTICE_LETTER } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { pronounce } from '@/shared/audio/pronounce'
import { usePronounce } from '@/shared/audio/usePronounce'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import type { Letter } from '@/types/letter'
import styles from './PracticeItem.module.css'

export interface PracticeResult {
  letter: Letter
  /** 0 when skipped, otherwise 1–3. */
  stars: number
  skipped: boolean
  /** The child looked at the letter before writing it. */
  hintUsed: boolean
}

interface PracticeItemProps {
  letter: Letter
  isLast: boolean
  onDone: (result: PracticeResult) => void
  /** Inside the lesson card: no outer card, so it doesn't look like a card inside a card. */
  embedded?: boolean
}

/**
 * One letter of a practice session: the child sees its name and hears it, then writes it from memory.
 * The letter itself is hidden unless they ask for a hint.
 */
export function PracticeItem({ letter, isLast, onDone, embedded = false }: PracticeItemProps) {
  const { t } = useI18n()
  const { earnPracticeXp } = useProgress()
  const audioUrl = letter.activities.listen.audioUrl
  const { play, playing, error } = usePronounce(audioUrl, letter.arabicName)
  const [hintUsed, setHintUsed] = useState(false)
  const [passed, setPassed] = useState<DrawingResult | null>(null)

  // Say the letter's name as soon as it appears. Ignored if the browser blocks sound
  // (e.g. the page was opened directly, without a tap first); the Listen button still works.
  useEffect(() => {
    pronounce({ audioUrl, text: letter.arabicName }).catch(() => {})
  }, [audioUrl, letter.arabicName])

  function handlePassed(result: DrawingResult) {
    setPassed(result)
    earnPracticeXp(XP_PER_PRACTICE_LETTER)
  }

  return (
    <Card className={embedded ? styles.embedded : styles.card}>
      <DrawingExercise
        glyph={letter.forms.isolated}
        mode="write"
        label={t('practice.canvas', { name: letter.name })}
        onPassed={handlePassed}
        prompt={
          <div className={styles.prompt}>
            <div className={styles.task}>
              <p className={styles.label}>{t('practice.prompt')}</p>
              <p className={styles.name}>{letter.name}</p>
              <SoundButtons onPlay={play} playing={playing} error={error} />
            </div>
            {hintUsed || passed ? (
              <span className={`arabic ${styles.hintGlyph}`} aria-label={letter.name}>
                {letter.forms.isolated}
              </span>
            ) : (
              <Button variant="secondary" onClick={() => setHintUsed(true)}>
                {t('practice.showHint')}
              </Button>
            )}
          </div>
        }
        extraActions={
          <Button variant="ghost" onClick={() => onDone({ letter, stars: 0, skipped: true, hintUsed })}>
            {t('practice.skip')}
          </Button>
        }
        passedActions={() => (
          <Button size="lg" onClick={() => onDone({ letter, stars: passed?.stars ?? 1, skipped: false, hintUsed })}>
            {t(isLast ? 'practice.finish' : 'practice.next')}
          </Button>
        )}
      />
    </Card>
  )
}
