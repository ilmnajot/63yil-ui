import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { ErrorMessage } from './StatusMessage'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Catches unexpected crashes in a part of the screen so the rest of the app keeps working. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected UI error', error, info.componentStack)
  }

  render() {
    if (this.state.error) return <CrashMessage onRetry={() => this.setState({ error: null })} />
    return this.props.children
  }
}

/** Class components can't use hooks, so the translated message lives in this small function component. */
function CrashMessage({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return <ErrorMessage message={t('error.crashed')} onRetry={onRetry} />
}
