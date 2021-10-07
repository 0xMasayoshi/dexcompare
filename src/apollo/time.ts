export const now = Math.floor(Date.now() / 1000)

export const now5 = Math.floor(Date.now() / 1000) - 5000

export const day = 86400

export function getWeekTimestamps(numWeeks) {
  const timestamps = []
  timestamps.push(now5)

  // first 100 weeks
  for (let i = 1; i <= numWeeks; i++) {
    timestamps.push(timestamps[i - 1] - day * 7)
  }

  return timestamps
}

export function getWeeksAgoTimestamp(numWeeks) {
  return now5 - day * 7 * numWeeks
}
