export function formatClock(date: Date, timeZone: string): string {
  const format = (zone: string) =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: zone,
    }).format(date)

  try {
    return format(timeZone)
  } catch {
    return format('UTC')
  }
}
