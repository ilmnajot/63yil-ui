import { useSyncExternalStore } from 'react'

/**
 * Phone-sized screens: narrow (portrait phone) or short (phone held sideways).
 * Matches the `(max-width: 599px), (max-height: 499px)` media query used in the CSS for compact layouts.
 */
export const COMPACT_QUERY = '(max-width: 599px), (max-height: 499px)'

/**
 * True while the CSS media query matches, and updates when the screen changes
 * (window resized, phone rotated).
 *
 * Prefer plain CSS `@media` for layout; use this only when *behaviour* must differ,
 * e.g. a section that starts collapsed on phones.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
