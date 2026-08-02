export function toLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getWeekDates(anchorDateStr: string): string[] {
  const [y, m, d] = anchorDateStr.split('-').map(Number)
  const anchor = new Date(y, m - 1, d)
  const dayOfWeek = anchor.getDay() // 0=Dom..6=Sáb
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() + diffToMonday)

  return Array.from({ length: 7 }, (_, i) => {
    const d2 = new Date(monday)
    d2.setDate(monday.getDate() + i)
    return toLocalISODate(d2)
  })
}

export function getMonthGrid(anchorDateStr: string): string[][] {
  const [y, m] = anchorDateStr.split('-').map(Number)
  const firstOfMonth = new Date(y, m - 1, 1)
  const startDow = firstOfMonth.getDay()
  const diffToMonday = startDow === 0 ? -6 : 1 - startDow
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() + diffToMonday)

  const weeks: string[][] = []
  const cursor = new Date(gridStart)
  for (let w = 0; w < 6; w++) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      week.push(toLocalISODate(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}