function toLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface DateSelectorProps {
  selectedDate: string
  onChange: (date: string) => void
}

function DateSelector({ selectedDate, onChange }: DateSelectorProps) {
  const today = new Date()

  const quickDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = toLocalISODate(d)
    const label = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' })
    return { iso, label }
  })

  return (
    <div className="mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickDates.map(({ iso, label }) => (
          <button
            key={iso}
            onClick={() => onChange(iso)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium font-display transition-colors ${
              selectedDate === iso
                ? 'bg-arena-lime text-arena-bg'
                : 'bg-arena-surface border border-arena-line text-arena-muted hover:text-arena-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        type="date"
        value={selectedDate}
        min={toLocalISODate(today)}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 rounded-md border border-arena-line bg-arena-surface px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50 [color-scheme:dark]"
      />
    </div>
  )
}

export default DateSelector