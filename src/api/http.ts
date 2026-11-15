import { env } from '@/config/env'

/** What went wrong, so the UI can show the right message. */
export type ApiErrorKind = 'network' | 'notFound' | 'server'

/** Thrown for any failed request, so screens can show one consistent error message. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number

  constructor(kind: ApiErrorKind, status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

/**
 * GET a JSON resource from the backend.
 * @param path - path after the base URL, e.g. `/letters/1`
 * @param signal - lets the caller cancel the request (e.g. when the screen closes)
 */
export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('network', 0, `Network error calling ${path}`)
  }

  if (!response.ok) {
    const kind = response.status === 404 ? 'notFound' : 'server'
    throw new ApiError(kind, response.status, `HTTP ${response.status} from ${path}`)
  }
  return (await response.json()) as T
}
