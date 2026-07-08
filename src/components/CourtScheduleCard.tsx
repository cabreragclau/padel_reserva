import type { Court, TimeSlot } from '../types'
import TimeSlotButton from './TimeSlotButton'
import DurationSelector from './DurationSelector'

interface CourtScheduleCardProps {
  court: Court
  slots: TimeSlot[]
  onSelectSlot: (court: Court, slot: TimeSlot) => void
  activeSlot: TimeSlot | null
  duration: number
  endTime: string
  confirming: boolean
  onDurationChange: (m: number) => void
  onConfirm: () => void
}

const SPORT_LABEL: Record<string, string> = {
  padel:  'Pádel',
  futbol: 'Fútbol',
}

const TYPE_LABEL: Record<string, string> = {
  techada:    'Techada',
  aire_libre: 'Aire libre',
}

function CourtScheduleCard({
  court, slots, onSelectSlot,
  activeSlot, duration, endTime, confirming,
  onDurationChange, onConfirm,
}: CourtScheduleCardProps) {
  return (
    <div className={`bg-arena-surface rounded-xl border transition-colors ${
      activeSlot ? 'border-arena-lime/40' : 'border-arena-line'
    }`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-medium text-lg tracking-wide">{court.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-arena-muted">
              {TYPE_LABEL[court.type]}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-arena-lime/60">
              · {SPORT_LABEL[court.sport]}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <TimeSlotButton
              key={slot.id}
              slot={slot}
              selected={activeSlot?.id === slot.id}
              onSelect={(s) => onSelectSlot(court, s)}
            />
          ))}
        </div>
      </div>

      {activeSlot && (
        <div className="border-t border-arena-lime/20 px-5 py-4 space-y-4">
          <p className="text-sm text-arena-muted">
            Seleccionaste las{' '}
            <strong className="text-arena-text font-display">{activeSlot.startTime}</strong>
          </p>
          <div>
            <p className="text-xs text-arena-muted uppercase tracking-widest mb-2">Duración</p>
            <DurationSelector
              maxMinutes={Math.min(activeSlot.maxDurationMinutes, court.max_duration_minutes)}
              selectedDuration={duration}
              onChange={onDurationChange}
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-arena-line">
            <p className="text-sm text-arena-muted">
              Termina a las <strong className="text-arena-text">{endTime}</strong>
            </p>
            <button
              onClick={onConfirm}
              disabled={confirming}
              className="bg-arena-lime text-arena-bg px-5 py-2 rounded-md font-display font-medium hover:bg-arena-lime/90 disabled:opacity-50"
            >
              {confirming ? 'Reservando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourtScheduleCard
