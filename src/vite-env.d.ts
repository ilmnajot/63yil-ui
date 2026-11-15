/// <reference types="vite/client" />

/** Environment variables the app reads. See `.env.example`. */
interface ImportMetaEnv {
  readonly VITE_USE_MOCKS?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** CSS Modules: `import styles from './X.module.css'` gives a map of class names. */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}
