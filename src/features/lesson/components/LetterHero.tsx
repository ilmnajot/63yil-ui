import { SoundButtons } from '@/features/activities/shared/SoundButtons'
import { usePronounce } from '@/shared/audio/usePronounce'
import { Card } from '@/shared/components/Card'
import type { Letter } from '@/types/letter'
import styles from './LetterHero.module.css'

/** Big letter with its name and play buttons. */
export function LetterHero({ letter }: { letter: Letter }) {
  const { play, playing, error } = usePronounce(letter.activities.listen.audioUrl, letter.arabicName)

  return (
    <Card className={styles.hero} aria-labelledby="letter-name">
      <div className={styles.glyphCircle}>
        <span className={`arabic ${styles.glyph}`} aria-hidden="true">
          {letter.arabic}
        </span>
      </div>
      <div className={styles.details}>
        <h1 id="letter-name" className={styles.name}>
          {letter.name} <span className="arabic">{letter.arabicName}</span>
        </h1>
        <SoundButtons onPlay={play} playing={playing} error={error} />
      </div>
    </Card>
  )
}
