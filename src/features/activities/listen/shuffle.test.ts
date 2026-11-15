import { describe, expect, it } from 'vitest'
import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('keeps every item and does not change the input', () => {
    const input = [1, 2, 3, 4]
    const result = shuffle(input)
    expect([...result].sort()).toEqual([1, 2, 3, 4])
    expect(input).toEqual([1, 2, 3, 4])
  })

  it('is predictable with an injected random source', () => {
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1])
  })
})
