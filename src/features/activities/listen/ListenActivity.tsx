import { useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { usePronounce } from '@/shared/audio/usePronounce'
import type { LetterSummary } from '@/types/letter'
import { SoundButtons } from '../shared/SoundButtons'
import type { ActivityProps } from '../types'
import { shuffle } from './shuffle'
import styles from './ListenActivity.module.css'

/** Listen: hear the letter, then tap it among a few choices. */
export function ListenActivity({ letter, onComplete }: ActivityProps) {
  const { t } = useI18n()
  const activity = letter.activities.listen
  const { play, playing, error } = usePronounce(activity.audioUrl, letter.arabicName)
  // Shuffled once per letter (the lesson page remounts this component for each letter).
  const [choices] = useState<LetterSummary[]>(() => shuffle([letter, ...activity.distractors]))
  const [wrongIds, setWrongIds] = useState<number[]>([])
  const [solved, setSolved] = useState(false)

  function handlePick(choice: LetterSummary) {
    if (solved) return
    if (choice.id === letter.id) {
      setSolved(true)
      onComplete()
    } else {
      setWrongIds((ids) => [...ids, choice.id])
      void play('normal')
    }
  }

  const message = solved
    ? t('listen.correct', { name: letter.name })
    : wrongIds.length > 0
      ? t('listen.wrong')
      : null

  return (
    <div className={styles.layout}>
      <p className={styles.instructions}>{activity.instructions}</p>
      <SoundButtons onPlay={play} playing={playing} error={error} size="lg" />

      <div className={styles.choices} role="group" aria-label={t('listen.question')}>
        {choices.map((choice) => {
          const isWrong = wrongIds.includes(choice.id)
          const isRight = solved && choice.id === letter.id
          return (
            <button
              key={choice.id}
              type="button"
              className={[styles.choice, isWrong && styles.wrong, isRight && styles.right].filter(Boolean).join(' ')}
              onClick={() => handlePick(choice)}
              disabled={isWrong || solved}
              aria-label={t('listen.choice', { name: choice.name })}
            >
              <span className="arabic">{choice.arabic}</span>
            </button>
          )
        })}
      </div>

      {message && (
        <p className={solved ? styles.success : styles.retry} role="status" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
