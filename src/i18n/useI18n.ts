/**
 * Interface texts. The app is Uzbek-only, but every visible string still goes through `t()`
 * so wording lives in one file (`messages/uz.ts`) and is easy to review or change.
 */
import { uz, type MessageKey } from './messages/uz'
import { formatMessage, type MessageParams } from './translate'

export type TranslateFn = (key: MessageKey, params?: MessageParams) => string

/** Returns the Uzbek text for `key`, e.g. `t('lesson.next', { name: 'Bo' })` → "Keyingi harf: Bo". */
export const t: TranslateFn = (key, params) => formatMessage(uz[key], params)

/** Hook form of `t`, used by components. */
export function useI18n(): { t: TranslateFn } {
  return { t }
}
