import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Court, TimeSlot } from '../types'

export interface Reservation {
  id: string
  court: Court
  slot: TimeSlot
  createdAt: string
}

interface ReservationContextValue {
  reservations: Reservation[]
  addReservation: (court: Court, slot: TimeSlot) => void
}

const ReservationContext = createContext<ReservationContextValue | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([])

  const addReservation = (court: Court, slot: TimeSlot) => {
    const newReservation: Reservation = {
      id: `${court.id}-${slot.id}-${Date.now()}`,
      court,
      slot,
      createdAt: new Date().toISOString(),
    }
    setReservations((prev) => [...prev, newReservation])
  }

  return (
    <ReservationContext.Provider value={{ reservations, addReservation }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservations() {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservations debe usarse dentro de ReservationProvider')
  }
  return context
}