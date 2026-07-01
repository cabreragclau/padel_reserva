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
          className={`px-3 py-1.5 rounded-md text-sm font-medium font-display border transition-colors ${
            selectedDuration === minutes
              ? 'bg-arena-lime text-arena-bg border-arena-lime'
              : 'bg-arena-bg text-arena-muted border-arena-line hover:text-arena-text'
          }`}
        >
          {minutes} min
        </button>
      ))}
    </div>
  )
}

export default DurationSelector