import type { Court, TimeSlot } from '../types'

export const mockCourts: Court[] = [
  { id: 'c1', name: 'Cancha 1', type: 'techada' },
  { id: 'c2', name: 'Cancha 2', type: 'techada' },
  { id: 'c3', name: 'Cancha 3', type: 'aire_libre' },
]

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function generateSlotsForCourt(courtId: string): TimeSlot[] {
  const startHour = 9
  const endHour = 22
  const slotDurationMinutes = 90

  const slots: TimeSlot[] = []
  let currentMinutes = startHour * 60
  const endMinutes = endHour * 60
  let index = 0

  while (currentMinutes + slotDurationMinutes <= endMinutes) {
    slots.push({
      id: `${courtId}-${index}`,
      courtId,
      startTime: minutesToTime(currentMinutes),
      endTime: minutesToTime(currentMinutes + slotDurationMinutes),
      isAvailable: Math.random() > 0.3, // simula algunas reservas al azar
    })
    currentMinutes += slotDurationMinutes
    index++
  }

  return slots
}

export const mockTimeSlots: TimeSlot[] = mockCourts.flatMap((court) =>
  generateSlotsForCourt(court.id)
)