export const fromCents = (cents?: number | null) => {
  if (typeof cents !== 'number') {
    return 0
  }
  return Number((cents / 100).toFixed(2))
}
export const toCents = (amount?: number | null) => {
  if (typeof amount !== 'number') {
    return 0
  }
  return Number((amount * 100).toFixed(2))
}
