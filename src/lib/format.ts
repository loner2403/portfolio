const MONTHS: Record<string, string> = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
}

function formatEndpoint(value: string): string | null {
  const trimmed = value.trim()
  if (/^(present|current|now)$/i.test(trimmed)) return 'now'

  const match = trimmed.match(/^([A-Za-z]{3,})\s+(\d{4})$/)
  if (!match) return null

  const month = MONTHS[match[1].slice(0, 3).toLowerCase()]
  if (!month) return null

  return `${match[2]}-${month}`
}

export function formatRange(duration: string): string {
  const parts = duration.split(/\s*[-–—]\s*/)
  if (parts.length !== 2) return duration

  const start = formatEndpoint(parts[0])
  const end = formatEndpoint(parts[1])
  if (!start || !end) return duration

  return `${start} → ${end}`
}
