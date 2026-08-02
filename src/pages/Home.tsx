import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { fetchCourtsWithAvailability } from '../lib/availability'
import { addMinutesToTime } from '../lib/time'
import CourtScheduleCard from '../components/CourtScheduleCard'
import DateSelector from '../components/DateSelector'
import SportFilter from '../components/SportFilter'
import type { Sport } from '../components/SportFilter'
import BookingSummaryBar from '../components/BookingSummaryBar'
import { useAuth } from '../lib/AuthContext'
import type { Court, TimeSlot } from '../types'

function getTodayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

function Home() {
  const [selectedDate, setSelectedDate] = useState(getTodayLocal())
  const [selectedSport, setSelectedSport] = useState<Sport>('padel')
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

  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport)
    setSelected(null)
  }

  const handleSelectSlot = (court: Court, slot: TimeSlot) => {
    if (!user) { navigate('/login'); return }
    if (selected?.court.id === court.id && selected?.slot.id === slot.id) {
      setSelected(null)
      return
    }
    setSelected({ court, slot })
    setDuration(60)
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

    supabase.functions.invoke('send-confirmation-email', {
      body: {
        to: user.email,
        courtName: selected.court.name,
        date: selectedDate,
        startTime: selected.slot.startTime,
        endTime,
      },
    })

    await loadAvailability(selectedDate)
    setSelected(null)
    setConfirming(false)
    navigate('/mis-reservas')
  }

  const filteredCourts = courts.filter((c) => c.sport === selectedSport)

  const sportMeta = {
    padel:  { label: '4 canchas · al aire libre', title: 'Reserva tu pista' },
    futbol: { label: '1 cancha · al aire libre',  title: 'Reserva la cancha' },
  }

  return (
    <div className={`px-6 py-10 ${selected ? 'pb-24' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <p className="text-arena-lime text-xs font-medium uppercase tracking-widest mb-2">
          {sportMeta[selectedSport].label}
        </p>
        <h1 className="font-display font-semibold text-3xl tracking-wide mb-6">
          {sportMeta[selectedSport].title}
        </h1>

        <SportFilter selected={selectedSport} onChange={handleSportChange} />

        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-900 text-red-400 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-arena-muted">Cargando disponibilidad...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourts.map((court) => (
              <CourtScheduleCard
                key={court.id}
                court={court}
                slots={slotsByCourt[court.id] ?? []}
                onSelectSlot={handleSelectSlot}
                activeSlot={selected?.court.id === court.id ? selected.slot : null}
                duration={duration}
                onDurationChange={setDuration}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <BookingSummaryBar
          court={selected.court}
          slot={selected.slot}
          date={selectedDate}
          duration={duration}
          confirming={confirming}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default Home