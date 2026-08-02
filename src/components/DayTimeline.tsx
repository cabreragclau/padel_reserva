import type { ScheduleReservation } from '../lib/adminSchedule'
import { timeToMinutes } from '../lib/time'

const OPENING = 8 * 60
const CLOSING = 24 * 60
const HOUR_HEIGHT = 56

interface DayTimelineProps {
  reservations: ScheduleReservation[]
}

function DayTimeline({ reservations }: DayTimelineProps) {
  const hours = Array.from({ length: (CLOSING - OPENING) / 60 }, (_, i) => OPENING / 60 + i)

  return (
    <div className="bg-arena-surface border border-arena-line rounded-xl overflow-hidden">
      <div className="relative" style={{ height: hours.length * HOUR_HEIGHT }}>
        {hours.map((h, i) => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-arena-line"
            style={{ top: i * HOUR_HEIGHT }}
          >
            <span className="text-xs text-arena-muted px-2 -mt-2 bg-arena-surface inline-block">
              {h.toString().padStart(2, '0')}:00
            </span>
          </div>
        ))}

        {reservations.map((r) => {
          const start = timeToMinutes(r.start_time.substring(0, 5))
          const end = timeToMinutes(r.end_time.substring(0, 5)) || CLOSING
          const top = ((start - OPENING) / 60) * HOUR_HEIGHT
          const height = ((end - start) / 60) * HOUR_HEIGHT

          return (
            <div
              key={r.id}
              className="absolute left-16 right-3 bg-arena-lime-dim border border-arena-lime/40 rounded-md px-3 py-1.5 overflow-hidden"
              style={{ top, height: Math.max(height, 24) }}
            >
              <p className="text-xs font-display font-medium text-arena-lime truncate">
                {r.start_time.substring(0, 5)} – {r.end_time.substring(0, 5)}
              </p>
              <p className="text-xs text-arena-muted truncate">{r.profiles?.email ?? 'Usuario eliminado'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DayTimeline