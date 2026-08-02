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
          className={`px-3 py-1.5 rounded-md text-sm font-medium font-display border transition-all duration-150 ease-out ${
            selectedDuration === minutes
              ? 'bg-arena-lime text-arena-bg border-arena-lime scale-105'
              : 'bg-arena-bg text-arena-muted border-arena-line hover:text-arena-text hover:scale-105 active:scale-95'
        }`}
        >
          {minutes} min
        </button>
      ))}
    </div>
  )
}

export default DurationSelector