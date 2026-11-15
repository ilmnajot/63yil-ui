import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import type { Speed } from '@/shared/audio/usePronounce'
import styles from './SoundButtons.module.css'

interface SoundButtonsProps {
  onPlay: (speed: Speed) => void
  playing: Speed | null
  error: string | null
  size?: 'md' | 'lg'
}

/** "Listen" and "Slow" play buttons, used wherever the child can hear a letter. */
export function SoundButtons({ onPlay, playing, error, size = 'md' }: SoundButtonsProps) {
  const { t } = useI18n()
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Button size={size} onClick={() => onPlay('normal')} aria-pressed={playing === 'normal'}>
          🔊 {playing === 'normal' ? t('sound.playing') : t('sound.listen')}
        </Button>
        <Button size={size} variant="secondary" onClick={() => onPlay('slow')} aria-pressed={playing === 'slow'}>
          🐢 {playing === 'slow' ? t('sound.playing') : t('sound.slow')}
        </Button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
