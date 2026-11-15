/**
 * Fisher–Yates shuffle. Returns a new array and leaves the input untouched.
 * @param random - source of randomness in [0, 1); injectable so tests are predictable
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
