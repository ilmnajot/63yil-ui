import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { pronounce, stopPronouncing } from './pronounce'

/** Speeds offered by the sound buttons. */
export const SPEEDS = { normal: 1, slow: 0.6 } as const
export type Speed = keyof typeof SPEEDS

/**
 * React wrapper around `pronounce`: tracks whether a sound is playing
 * and stops it when the component unmounts.
 */
export function usePronounce(audioUrl: string | null, text: string) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState<Speed | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => stopPronouncing, [])

  const play = useCallback(
    async (speed: Speed = 'normal') => {
      setFailed(false)
      setPlaying(speed)
      try {
        await pronounce({ audioUrl, text, rate: SPEEDS[speed] })
      } catch (err) {
        console.warn('Could not play letter sound', err)
        setFailed(true)
      } finally {
        setPlaying(null)
      }
    },
    [audioUrl, text],
  )

  return { play, playing, error: failed ? t('sound.error') : null }
}
