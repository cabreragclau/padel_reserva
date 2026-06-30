import type { TimeSlot } from '../types'

interface TimeSlotButtonProps {
  slot: TimeSlot
  onSelect: (slot: TimeSlot) => void
}

function TimeSlotButton({ slot, onSelect }: TimeSlotButtonProps) {
  if (!slot.isAvailable) {
    return (
      <button
        disabled
        className="px-3 py-2 rounded-md text-sm font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
      >
        {slot.startTime}
      </button>
    )
  }

  return (
    <button
      onClick={() => onSelect(slot)}
      className="px-3 py-2 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
    >
      {slot.startTime}
    </button>
  )
}

export default TimeSlotButton