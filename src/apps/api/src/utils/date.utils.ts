/** UTC midnight of the given date (defaults to now) — used as the grouping key for daily records. */
export const startOfUtcDay = (date: Date = new Date()): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
