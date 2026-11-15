import { ApiError } from '../http'
import type { LettersApi } from '../lettersApi'
import { mockLetters, mockLetterSummaries } from './lettersData'

/** Simulated network delay, so loading states are visible during development. */
const DELAY_MS = 250

function delay<T>(value: () => T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try {
        resolve(value())
      } catch (error) {
        reject(error)
      }
    }, DELAY_MS)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

/** In-memory implementation of the letters API. */
export const mockLettersApi: LettersApi = {
  list: (signal) => delay(() => mockLetterSummaries, signal),
  get: (id, signal) =>
    delay(() => {
      const letter = mockLetters.find((item) => item.id === id)
      if (!letter) throw new ApiError('notFound', 404, `Mock letter ${id} does not exist`)
      return letter
    }, signal),
}
