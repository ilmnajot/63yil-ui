import { useEffect, useState } from 'react'
import { DrawingExercise } from '@/features/activities/drawing/DrawingExercise'
import type { DrawingResult } from '@/features/activities/drawing/scoring'
import { SoundButtons } from '@/features/activities/shared/SoundButtons'
import { useI18n } from '@/i18n/useI18n'
import { pronounce } from '@/shared/audio/pronounce'
import { usePronounce } from '@/shared/audio/usePronounce'
import { Button } from '@/shared/components/Button'
import { DRILL_FEATURES, type Drill } from '@/types/letter'
import styles from './DrillItem.module.css'

export interface DrillResult {
  drill: Drill
  /** Stars of the written (second) drawing; 0 when skipped. */
  stars: number
  skipped: boolean
}

interface DrillItemProps {
  drill: Drill
  isLast: boolean
  onDone: (result: DrillResult) => void
}

/**
 * One drill in two phases: first trace it over the dotted guide, then write it from memory.
 * Shows what it practises (zabar, jazm, tashdid…) with a one-line tip about the hardest part.
 */
export function DrillItem({ drill, isLast, onDone }: DrillItemProps) {
  const { t } = useI18n()
  const { play, playing, error } = usePronounce(drill.audioUrl, drill.text)
  const [phase, setPhase] = useState<'trace' | 'write'>('trace')
  const [result, setResult] = useState<DrawingResult | null>(null)
  // The tip explains the most advanced thing in the drill (features are listed simple → hard).
  const hardest = [...drill.features].sort((a, b) => DRILL_FEATURES.indexOf(b) - DRILL_FEATURES.indexOf(a))[0]

  // Read the drill aloud when it appears; ignored if the browser blocks sound before a tap.
  useEffect(() => {
    pronounce({ audioUrl: drill.audioUrl, text: drill.text }).catch(() => {})
  }, [drill.audioUrl, drill.text])

  const prompt = (
    <div className={styles.prompt}>
      <ul className={styles.features} aria-label={drill.features.map((f) => t(`join.feature.${f}`)).join(', ')}>
        {drill.features.map((feature) => (
          <li key={feature} className={`${styles.feature} ${styles[feature]}`}>
            {t(`join.feature.${feature}`)}
          </li>
        ))}
      </ul>
      <p className={styles.phase}>{t(phase === 'trace' ? 'join.phase.trace' : 'join.phase.write')}</p>
      {hardest && <p className={styles.tip}>{t(`join.tip.${hardest}`)}</p>}
      <SoundButtons onPlay={play} playing={playing} error={error} />
      {phase === 'write' && (
        <p className={`arabic ${styles.model}`} aria-hidden="true">
          {drill.text}
        </p>
      )}
    </div>
  )

  return (
    <DrawingExercise
      // A new key per phase gives the write phase a fresh, empty canvas.
      key={phase}
      glyph={drill.text}
      mode={phase}
      label={t(phase === 'trace' ? 'join.canvasTrace' : 'join.canvasWrite', { text: drill.text })}
      prompt={prompt}
      onPassed={setResult}
      extraActions={
        <Button variant="ghost" onClick={() => onDone({ drill, stars: 0, skipped: true })}>
          {t('practice.skip')}
        </Button>
      }
      passedActions={() =>
        phase === 'trace' ? (
          <Button size="lg" onClick={() => setPhase('write')}>
            {t('join.toWrite')}
          </Button>
        ) : (
          <Button size="lg" onClick={() => onDone({ drill, stars: result?.stars ?? 1, skipped: false })}>
            {t(isLast ? 'join.finish' : 'join.next')}
          </Button>
        )
      }
    />
  )
}
