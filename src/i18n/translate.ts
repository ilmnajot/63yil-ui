/** Values inserted into a message, e.g. `{ name: 'Alif' }` for "Trace {name}". */
export type MessageParams = Record<string, string | number>

/**
 * Fills `{placeholders}` in a message. Unknown placeholders are left as they are,
 * so a missing value is visible instead of silently disappearing.
 */
export function formatMessage(message: string, params?: MessageParams): string {
  if (!params) return message
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}
