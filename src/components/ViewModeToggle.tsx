type ViewMode = 'day' | 'week' | 'month'

interface ViewModeToggleProps {
  mode: ViewMode
  onChange: (m: ViewMode) => void
}

function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  const options: { value: ViewMode; label: string }[] = [
    { value: 'day', label: 'Día' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ]

  return (
    <div className="inline-flex bg-arena-surface border border-arena-line rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-display font-medium transition-colors ${
            mode === opt.value ? 'bg-arena-lime text-arena-bg' : 'text-arena-muted hover:text-arena-text'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default ViewModeToggle
export type { ViewMode }