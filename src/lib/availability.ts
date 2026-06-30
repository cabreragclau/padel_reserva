import { supabase } from './supabaseClient'
import { minutesToTime, timeToMinutes } from './time'
import type { Court, TimeSlot } from '../types'

const OPENING_MINUTES = 8 * 60     // 08:00
const CLOSING_MINUTES = 24 * 60    // 00:00 (medianoche)
const SLOT_STEP_MINUTES = 60       // un horario de inicio posible cada hora
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
        end: timeToMinutes(r.end_time.substring(0, 5)) || CLOSING_MINUTES, // 00:00 -> medianoche
      }))
      .sort((a, b) => a.start - b.start)

    const slots: TimeSlot[] = []

    for (
      let start = OPENING_MINUTES;
      start <= CLOSING_MINUTES - MIN_DURATION_MINUTES;
      start += SLOT_STEP_MINUTES
    ) {
      const isBlocked = courtReservations.some((r) => start >= r.start && start < r.end)

      if (isBlocked) {
        slots.push({
          id: `${court.id}-${minutesToTime(start)}`,
          courtId: court.id,
          startTime: minutesToTime(start),
          maxDurationMinutes: 0,
          isAvailable: false,
        })
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