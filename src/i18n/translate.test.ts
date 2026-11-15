import { describe, expect, it } from 'vitest'
import { uz } from './messages/uz'
import { formatMessage } from './translate'

describe('formatMessage', () => {
  it('fills placeholders', () => {
    expect(formatMessage('{total} tadan {order}-harf', { order: 2, total: 28 })).toBe('28 tadan 2-harf')
  })

  it('leaves unknown placeholders visible', () => {
    expect(formatMessage('Salom {name}', {})).toBe('Salom {name}')
  })
})

describe('Uzbek messages', () => {
  it('has no empty texts', () => {
    for (const [key, text] of Object.entries(uz)) expect(text.trim(), key).not.toBe('')
  })

  it('uses the Uzbek apostrophes ʻ and ʼ, not a plain quote or backtick', () => {
    for (const [key, text] of Object.entries(uz)) expect(text, key).not.toMatch(/[a-z]['`][a-z]/i)
  })
})
