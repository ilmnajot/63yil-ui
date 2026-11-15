/**
 * Letters API. Screens call these functions and never `fetch` directly,
 * so switching between mock data and the real backend happens only here.
 */
import { env } from '@/config/env'
import type { Letter, LetterSummary } from '@/types/letter'
import { getJson } from './http'
import { mockLettersApi } from './mock/mockLettersApi'

export interface LettersApi {
  /** `GET /letters`: all active letters, sorted by `order`. */
  list(signal?: AbortSignal): Promise<LetterSummary[]>
  /** `GET /letters/{id}`: one letter with all four of its activities. */
  get(id: number, signal?: AbortSignal): Promise<Letter>
}

const httpLettersApi: LettersApi = {
  list: (signal) => getJson<LetterSummary[]>('/letters', signal),
  get: (id, signal) => getJson<Letter>(`/letters/${id}`, signal),
}

export const lettersApi: LettersApi = env.useMocks ? mockLettersApi : httpLettersApi
