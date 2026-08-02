const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface MonthGridProps {
  weeks: string[][]
  countsByDate: Record<string, number>
  currentMonth: number
  onSelectDate: (date: string) => void
}

function MonthGrid({ weeks, countsByDate, currentMonth, onSelectDate }: MonthGridProps) {
  return (
    <div className="bg-arena-surface border border-arena-line rounded-xl overflow-hidden">
      <div className="grid grid-cols-7 border-b border-arena-line">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase text-arena-muted py-2">{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-arena-line last:border-b-0">
          {week.map((date) => {
            const dayNum = parseInt(date.split('-')[2], 10)
            const monthOfDate = parseInt(date.split('-')[1], 10)
            const isOtherMonth = monthOfDate !== currentMonth
            const count = countsByDate[date] ?? 0
            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className={`aspect-square border-r border-arena-line last:border-r-0 flex flex-col items-center justify-center gap-1 hover:bg-arena-lime-dim transition-colors ${
                  isOtherMonth ? 'opacity-30' : ''
                }`}
              >
                <span className="text-xs font-display text-arena-text">{dayNum}</span>
                {count > 0 && (
                  <span className="text-[10px] font-display font-semibold text-arena-lime bg-arena-lime-dim px-1.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default MonthGrid