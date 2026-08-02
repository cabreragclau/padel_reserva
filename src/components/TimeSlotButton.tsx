import type { TimeSlot } from '../types'

interface TimeSlotButtonProps {
  slot: TimeSlot
  selected: boolean
  onSelect: (slot: TimeSlot) => void
}

function TimeSlotButton({ slot, selected, onSelect }: TimeSlotButtonProps) {
  if (!slot.isAvailable) {
    return (
      <button
        disabled
        className="px-3 py-2 rounded-md text-sm font-medium font-display bg-arena-bg text-arena-muted/40 border border-arena-line cursor-not-allowed"
      >
        {slot.startTime}
      </button>
    )
  }

  if (selected) {
    return (
      <button
        onClick={() => onSelect(slot)}
        className="px-3 py-2 rounded-md text-sm font-medium font-display bg-arena-lime text-arena-bg border border-arena-lime scale-105 shadow-[0_0_0_3px_rgba(212,255,63,0.15)] transition-all duration-200 ease-out"
      >
        {slot.startTime}
      </button>
    )
  }

  return (
    <button
      onClick={() => onSelect(slot)}
      className="px-3 py-2 rounded-md text-sm font-medium font-display bg-arena-lime-dim text-arena-lime border border-arena-lime/30 hover:bg-arena-lime hover:text-arena-bg hover:scale-105 active:scale-95 transition-all duration-150 ease-out"
    >
      {slot.startTime}
    </button>
  )
}

export default TimeSlotButton