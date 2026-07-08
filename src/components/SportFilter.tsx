const SPORTS = [
  { value: 'padel',  label: '🎾 Pádel',  count: '4 canchas' },
  { value: 'futbol', label: '⚽ Fútbol', count: '1 cancha'  },
] as const

type Sport = typeof SPORTS[number]['value']

interface SportFilterProps {
  selected: Sport
  onChange: (sport: Sport) => void
}

function SportFilter({ selected, onChange }: SportFilterProps) {
  return (
    <div className="flex gap-3 mb-6">
      {SPORTS.map((sport) => (
        <button
          key={sport.value}
          onClick={() => onChange(sport.value)}
          className={`flex-1 py-3 px-4 rounded-xl border transition-colors text-left ${
            selected === sport.value
              ? 'bg-arena-lime-dim border-arena-lime/40'
              : 'bg-arena-surface border-arena-line hover:border-arena-muted'
          }`}
        >
          <p className={`font-display font-medium tracking-wide text-sm ${
            selected === sport.value ? 'text-arena-lime' : 'text-arena-muted'
          }`}>
            {sport.label}
          </p>
          <p className="text-xs text-arena-muted mt-0.5">{sport.count}</p>
        </button>
      ))}
    </div>
  )
}

export default SportFilter
export type { Sport }
