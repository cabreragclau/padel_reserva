import type { ScheduleReservation } from '../lib/adminSchedule'
import { timeToMinutes } from '../lib/time'

const OPENING = 8 * 60
const CLOSING = 24 * 60
const HOUR_HEIGHT = 44
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface WeekGridProps {
  weekDates: string[]
  reservationsByDate: Record<string, ScheduleReservation[]>
}

function formatDayNum(dateStr: string): string {
  return dateStr.split('-')[2]
}

function WeekGrid({ weekDates, reservationsByDate }: WeekGridProps) {
  const hours = Array.from({ length: (CLOSING - OPENING) / 60 }, (_, i) => OPENING / 60 + i)
  const totalHeight = hours.length * HOUR_HEIGHT

  return (
    <div className="bg-arena-surface border border-arena-line rounded-xl overflow-x-auto">
      <div className="flex min-w-[720px]">
        <div className="w-14 shrink-0 border-r border-arena-line">
          <div className="h-10 border-b border-arena-line" />
          <div className="relative" style={{ height: totalHeight }}>
            {hours.map((h, i) => (
              <span
                key={h}
                className="absolute left-1 text-[10px] text-arena-muted"
                style={{ top: i * HOUR_HEIGHT - 6 }}
              >
                {h.toString().padStart(2, '0')}:00
              </span>
            ))}
          </div>
        </div>

        {weekDates.map((date, dayIdx) => (
          <div key={date} className="flex-1 min-w-[92px] border-r border-arena-line last:border-r-0">
            <div className="h-10 flex flex-col items-center justify-center border-b border-arena-line">
              <span className="text-[10px] text-arena-muted uppercase">{DAY_LABELS[dayIdx]}</span>
              <span className="text-xs font-display font-medium text-arena-text">{formatDayNum(date)}</span>
            </div>
            <div className="relative" style={{ height: totalHeight }}>
              {hours.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-arena-line/50"
                  style={{ top: i * HOUR_HEIGHT }}
                />
              ))}
              {(reservationsByDate[date] ?? []).map((r) => {
                const start = timeToMinutes(r.start_time.substring(0, 5))
                const end = timeToMinutes(r.end_time.substring(0, 5)) || CLOSING
                const top = ((start - OPENING) / 60) * HOUR_HEIGHT
                const height = ((end - start) / 60) * HOUR_HEIGHT
                return (
                  <div
                    key={r.id}
                    className="absolute left-0.5 right-0.5 bg-arena-lime-dim border border-arena-lime/40 rounded px-1 py-0.5 overflow-hidden"
                    style={{ top, height: Math.max(height, 16) }}
                  >
                    <p className="text-[9px] font-display font-medium text-arena-lime leading-tight truncate">
                      {r.start_time.substring(0, 5)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeekGrid