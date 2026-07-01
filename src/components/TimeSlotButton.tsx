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
        className="px-3 py-2 rounded-md text-sm font-medium font-display bg-arena-lime text-arena-bg border border-arena-lime"
      >
        {slot.startTime}
      </button>
    )
  }

  return (
    <button
      onClick={() => onSelect(slot)}
      className="px-3 py-2 rounded-md text-sm font-medium font-display bg-arena-lime-dim text-arena-lime border border-arena-lime/30 hover:bg-arena-lime hover:text-arena-bg transition-colors"
    >
      {slot.startTime}
    </button>
  )
}

export default TimeSlotButton