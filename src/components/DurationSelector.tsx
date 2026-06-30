const STANDARD_DURATIONS = [60, 90, 120]

interface DurationSelectorProps {
  maxMinutes: number
  selectedDuration: number
  onChange: (minutes: number) => void
}

function DurationSelector({ maxMinutes, selectedDuration, onChange }: DurationSelectorProps) {
  const options = STANDARD_DURATIONS.filter((d) => d <= maxMinutes)

  return (
    <div className="flex gap-2">
      {options.map((minutes) => (
        <button
          key={minutes}
          onClick={() => onChange(minutes)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
            selectedDuration === minutes
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
          }`}
        >
          {minutes} min
        </button>
      ))}
    </div>
  )
}

export default DurationSelector