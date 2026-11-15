/**
 * Central place for runtime configuration.
 * Values come from Vite env variables (`.env`, `.env.local`), see `.env.example`.
 */
export const env = {
  /** When true, the app serves built-in mock data instead of calling the backend. Defaults to true. */
  useMocks: import.meta.env.VITE_USE_MOCKS !== 'false',
  /** Base URL that every API path is appended to, e.g. `/api` or `https://api.example.com/api`. */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, ''),
} as const
