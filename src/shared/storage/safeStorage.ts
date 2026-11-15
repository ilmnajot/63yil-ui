/**
 * Small wrapper around `localStorage` that never throws.
 * Storage can be unavailable (private mode, blocked cookies), so every
 * read falls back to a default value and every write fails silently.
 */
export const safeStorage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  },

  write(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked: progress just won't survive a reload.
    }
  },
}
