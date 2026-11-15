import { ApiError } from '@/api/http'
import type { TranslateFn } from './useI18n'

/** Turns any error into a message the child (or parent) can read. */
export function describeError(error: Error, t: TranslateFn): string {
  if (!(error instanceof ApiError)) return t('error.generic')
  switch (error.kind) {
    case 'network':
      return t('error.network')
    case 'notFound':
      return t('error.notFound')
    case 'server':
      return t('error.server')
  }
}
