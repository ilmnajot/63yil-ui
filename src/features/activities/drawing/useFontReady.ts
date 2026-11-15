import { useEffect, useState } from 'react'
import { GLYPH_FONT_FAMILY } from './glyphPainter'

/**
 * True once the Arabic web font is loaded. Canvas does not wait for web fonts,
 * so drawing before this would show (and score against) a fallback font.
 */
export function useFontReady(sample: string): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const done = () => active && setReady(true)
    // If the font can't load (offline), carry on with the fallback font rather than block the child.
    document.fonts.load(`100px ${GLYPH_FONT_FAMILY}`, sample).then(done, done)
    return () => {
      active = false
    }
  }, [sample])

  return ready
}
