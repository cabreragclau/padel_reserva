import { supabase } from './supabaseClient'

export interface ScheduleReservation {
  id: string
  date: string
  start_time: string
  end_time: string
  profiles: { email: string } | null
}

export async function fetchCourtReservations(
  courtId: string,
  startDate: string,
  endDate: string
): Promise<ScheduleReservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, date, start_time, end_time, profiles!reservations_user_id_fkey(email)')
    .eq('court_id', courtId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('start_time')

  if (error) throw new Error(error.message)
  return data as unknown as ScheduleReservation[]
}