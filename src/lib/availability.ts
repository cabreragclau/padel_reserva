import { supabase } from './supabaseClient'
import { minutesToTime, timeToMinutes } from './time'
import type { Court, TimeSlot } from '../types'

const OPENING_MINUTES = 8 * 60     // 08:00
const CLOSING_MINUTES = 24 * 60    // 00:00 (medianoche)
const SLOT_STEP_MINUTES = 60       // grilla base cada hora
const MIN_DURATION_MINUTES = 60    // toda reserva dura al menos 1 hora

interface ExistingReservation {
  start: number
  end: number
}

export async function fetchCourtsWithAvailability(date: string): Promise<{
  courts: Court[]
  slotsByCourt: Record<string, TimeSlot[]>
}> {
  const { data: courts, error: courtsError } = await supabase
    .from('courts')
    .select('*')
    .order('name')

  if (courtsError) throw new Error(courtsError.message)

  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select('court_id, start_time, end_time')
    .eq('date', date)

  if (resError) throw new Error(resError.message)

  const slotsByCourt: Record<string, TimeSlot[]> = {}

  for (const court of courts) {
    const courtReservations: ExistingReservation[] = reservations
      .filter((r) => r.court_id === court.id)
      .map((r) => ({
        start: timeToMinutes(r.start_time.substring(0, 5)),
        end: timeToMinutes(r.end_time.substring(0, 5)) || CLOSING_MINUTES,
      }))
      .sort((a, b) => a.start - b.start)

    // 1. Grilla base cada hora
    const candidateStarts = new Set<number>()
    for (
      let t = OPENING_MINUTES;
      t <= CLOSING_MINUTES - MIN_DURATION_MINUTES;
      t += SLOT_STEP_MINUTES
    ) {
      candidateStarts.add(t)
    }

    // 2. Sumar el fin exacto de cada reserva existente: elimina los "tiempos muertos"
    for (const r of courtReservations) {
      if (r.end >= OPENING_MINUTES && r.end <= CLOSING_MINUTES - MIN_DURATION_MINUTES) {
        candidateStarts.add(r.end)
      }
    }

    const sortedStarts = Array.from(candidateStarts).sort((a, b) => a - b)

    const slots: TimeSlot[] = []
    for (const start of sortedStarts) {
      const isBlocked = courtReservations.some((r) => start >= r.start && start < r.end)

      if (isBlocked) {
        // No mostramos horarios de inicio que caen dentro de una reserva existente
        continue
      }

      const nextReservation = courtReservations.find((r) => r.start > start)
      const limit = nextReservation ? nextReservation.start : CLOSING_MINUTES
      const maxDurationMinutes = limit - start

      slots.push({
        id: `${court.id}-${minutesToTime(start)}`,
        courtId: court.id,
        startTime: minutesToTime(start),
        maxDurationMinutes,
        isAvailable: maxDurationMinutes >= MIN_DURATION_MINUTES,
      })
    }

    slotsByCourt[court.id] = slots
  }

  return { courts, slotsByCourt }
}