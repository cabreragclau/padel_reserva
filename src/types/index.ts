export interface Court {
  id: string
  name: string
  type: 'techada' | 'aire_libre'
  sport: 'padel' | 'futbol'
  max_duration_minutes: number
  created_at: string
}

export interface TimeSlot {
  id: string
  courtId: string
  startTime: string
  maxDurationMinutes: number
  isAvailable: boolean
}
