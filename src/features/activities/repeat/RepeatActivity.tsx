import { useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { usePronounce } from '@/shared/audio/usePronounce'
import { SoundButtons } from '../shared/SoundButtons'
import type { ActivityProps } from '../types'
import { useRecorder } from './useRecorder'
import styles from './RepeatActivity.module.css'

/**
 * Repeat: listen to the letter, record yourself saying it, then compare both.
 * The child (or a parent/teacher) decides if it sounded right; there is no automatic scoring yet.
 */
export function RepeatActivity({ letter, onComplete }: ActivityProps) {
  const { t } = useI18n()
  const activity = letter.activities.repeat
  const { play, playing, error } = usePronounce(activity.audioUrl, letter.arabicName)
  const { status, recordingUrl, start, stop } = useRecorder()
  const [done, setDone] = useState(false)
  const micUnavailable = status === 'denied' || status === 'unsupported'

  function finish() {
    setDone(true)
    onComplete()
  }

  return (
    <div className={styles.layout}>
      <p className={styles.instructions}>{activity.instructions}</p>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <div className={styles.stepBody}>
            <h3>{t('repeat.step.listen')}</h3>
            <SoundButtons onPlay={play} playing={playing} error={error} />
          </div>
        </li>

        <li className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <div className={styles.stepBody}>
            <h3>{t('repeat.step.record')}</h3>
            {micUnavailable ? (
              <p className={styles.note} role="alert">
                {t(status === 'denied' ? 'repeat.micDenied' : 'repeat.micUnsupported')}
              </p>
            ) : status === 'recording' ? (
              <Button className={styles.recording} onClick={stop}>
                <span className={styles.recordDot} aria-hidden="true" /> {t('repeat.stop')}
              </Button>
            ) : (
              <Button onClick={start} disabled={status === 'requesting'}>
                {t(status === 'recorded' ? 'repeat.recordAgain' : 'repeat.record')}
              </Button>
            )}
          </div>
        </li>

        <li className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <div className={styles.stepBody}>
            <h3>{t('repeat.step.compare')}</h3>
            {recordingUrl ? (
              <div className={styles.compare}>
                <span className={styles.label}>{t('repeat.yourVoice')}</span>
                <audio src={recordingUrl} controls className={styles.audio} />
              </div>
            ) : (
              <p className={styles.note}>{t(micUnavailable ? 'repeat.selfCheck' : 'repeat.placeholder')}</p>
            )}
          </div>
        </li>
      </ol>

      {done ? (
        <p className={styles.success} role="status">
          {t('repeat.done', { name: letter.name })}
        </p>
      ) : (
        <Button size="lg" onClick={finish} disabled={!recordingUrl && !micUnavailable}>
          {t('repeat.confirm')}
        </Button>
      )}
    </div>
  )
}
