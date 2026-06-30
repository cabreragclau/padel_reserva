import type { Court, TimeSlot } from '../types'
import TimeSlotButton from './TimeSlotButton'

interface CourtScheduleCardProps {
  court: Court
  slots: TimeSlot[]
  onSelectSlot: (court: Court, slot: TimeSlot) => void
}

function CourtScheduleCard({ court, slots, onSelectSlot }: CourtScheduleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{court.name}</h3>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {court.type === 'techada' ? 'Techada' : 'Aire libre'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot.id}
            slot={slot}
            onSelect={(selected) => onSelectSlot(court, selected)}
          />
        ))}
      </div>
    </div>
  )
}

export default CourtScheduleCard