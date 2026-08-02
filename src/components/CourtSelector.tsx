import type { Court } from '../types'

interface CourtSelectorProps {
  courts: Court[]
  selectedCourtId: string | null
  onChange: (courtId: string) => void
}

function CourtSelector({ courts, selectedCourtId, onChange }: CourtSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {courts.map((court) => (
        <button
          key={court.id}
          onClick={() => onChange(court.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-display font-medium transition-colors ${
            selectedCourtId === court.id
              ? 'bg-arena-lime text-arena-bg'
              : 'bg-arena-surface border border-arena-line text-arena-muted hover:text-arena-text'
          }`}
        >
          {court.name}
        </button>
      ))}
    </div>
  )
}

export default CourtSelector