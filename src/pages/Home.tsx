import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { fetchCourtsWithAvailability } from '../lib/availability'
import { addMinutesToTime } from '../lib/time'
import CourtScheduleCard from '../components/CourtScheduleCard'
import DateSelector from '../components/DateSelector'
import DurationSelector from '../components/DurationSelector'
import { useAuth } from '../lib/AuthContext'
import type { Court, TimeSlot } from '../types'

function getTodayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

function Home() {
  const [selectedDate, setSelectedDate] = useState(getTodayLocal())
  const [courts, setCourts] = useState<Court[]>([])
  const [slotsByCourt, setSlotsByCourt] = useState<Record<string, TimeSlot[]>>({})
  const [selected, setSelected] = useState<{ court: Court; slot: TimeSlot } | null>(null)
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadAvailability = async (date: string) => {
    setLoading(true)
    setSelected(null)
    setError(null)
    try {
      const { courts, slotsByCourt } = await fetchCourtsWithAvailability(date)
      setCourts(courts)
      setSlotsByCourt(slotsByCourt)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error cargando canchas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAvailability(selectedDate) }, [selectedDate])

  const handleSelectSlot = (court: Court, slot: TimeSlot) => {
    if (!user) { navigate('/login'); return }
    setSelected({ court, slot })
    setDuration(60) // siempre arranca en el mínimo permitido
  }

  const handleConfirm = async () => {
    if (!selected || !user) return
    setConfirming(true)
    setError(null)

    const endTime = addMinutesToTime(selected.slot.startTime, duration)

    const { error } = await supabase.from('reservations').insert({
      court_id: selected.court.id,
      user_id: user.id,
      date: selectedDate,
      start_time: selected.slot.startTime,
      end_time: endTime,
    })

    if (error) {
      setError('No se pudo reservar. El horario puede ya no estar disponible.')
      setConfirming(false)
      return
    }

    await loadAvailability(selectedDate)
    setSelected(null)
    setConfirming(false)
    navigate('/mis-reservas')
  }

  return (
    <div className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Canchas disponibles</h1>
        <p className="text-slate-500 mb-6">Selecciona un día y reserva tu horario</p>

        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-slate-400">Cargando disponibilidad...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courts.map((court) => (
              <CourtScheduleCard
                key={court.id}
                court={court}
                slots={slotsByCourt[court.id] ?? []}
                onSelectSlot={handleSelectSlot}
              />
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-8 bg-white border border-emerald-200 rounded-xl p-5 space-y-4">
            <p className="text-slate-700">
              <strong>{selected.court.name}</strong> · {selectedDate} · desde las <strong>{selected.slot.startTime}</strong>
            </p>

            <div>
              <p className="text-sm text-slate-500 mb-2">Duración</p>
              <DurationSelector
                maxMinutes={selected.slot.maxDurationMinutes}
                selectedDuration={duration}
                onChange={setDuration}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Termina a las <strong>{addMinutesToTime(selected.slot.startTime, duration)}</strong>
              </p>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {confirming ? 'Reservando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home