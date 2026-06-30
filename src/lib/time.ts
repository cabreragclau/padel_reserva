export function minutesToTime(totalMinutes: number): string {
  const h = (Math.floor(totalMinutes / 60) % 24).toString().padStart(2, '0')
  const m = (totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  return minutesToTime(timeToMinutes(time) + minutesToAdd)
}