import type { Court, TimeSlot } from '../types'
import { addMinutesToTime } from '../lib/time'

const SPORT_LABEL: Record<string, string> = {
  padel:  'Pádel',
  futbol: 'Fútbol',
}

function formatDateLabel(dateStr: string): string {
  const today = new Date()
  const todayIso = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  if (dateStr === todayIso) return 'Hoy'

  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
}

interface BookingSummaryBarProps {
  court: Court
  slot: TimeSlot
  date: string
  duration: number
  confirming: boolean
  onConfirm: () => void
}

function BookingSummaryBar({ court, slot, date, duration, confirming, onConfirm }: BookingSummaryBarProps) {
  const endTime = addMinutesToTime(slot.startTime, duration)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-arena-surface border-t border-arena-lime/30 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.4)] animate-[slideUp_0.25s_ease-out]">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-arena-text truncate">
            <span className="font-display font-medium">{SPORT_LABEL[court.sport]} {court.name}</span>
            <span className="text-arena-muted"> · {formatDateLabel(date)} {slot.startTime} ({duration} min)</span>
          </p>
          <p className="text-xs text-arena-muted mt-0.5">
            Hasta las <span className="text-arena-lime font-medium">{endTime}</span>
          </p>
        </div>
        <button
          onClick={onConfirm}
          disabled={confirming}
          className="shrink-0 bg-arena-lime text-arena-bg px-5 py-2.5 rounded-md font-display font-medium hover:bg-arena-lime/90 disabled:opacity-50"
        >
          {confirming ? 'Reservando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  )
}

export default BookingSummaryBar