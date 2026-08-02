import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { fetchCourtReservations, type ScheduleReservation } from '../lib/adminSchedule'
import { getWeekDates, getMonthGrid, toLocalISODate } from '../lib/dateUtils'
import CourtSelector from '../components/CourtSelector'
import ViewModeToggle, { type ViewMode } from '../components/ViewModeToggle'
import DayTimeline from '../components/DayTimeline'
import WeekGrid from '../components/WeekGrid'
import MonthGrid from '../components/MonthGrid'
import type { Court } from '../types'

function AdminCalendar() {
  const { user, role, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null)
  const [mode, setMode] = useState<ViewMode>('week')
  const [anchorDate, setAnchorDate] = useState(toLocalISODate(new Date()))
  const [reservations, setReservations] = useState<ScheduleReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || role !== 'admin') { navigate('/'); return }

    supabase.from('courts').select('*').order('name').then(({ data }) => {
      if (data) {
        setCourts(data as Court[])
        setSelectedCourtId((prev) => prev ?? (data[0]?.id ?? null))
      }
    })
  }, [user, role, authLoading, navigate])

  useEffect(() => {
    if (!selectedCourtId) return

    let startDate = anchorDate
    let endDate = anchorDate

    if (mode === 'week') {
      const week = getWeekDates(anchorDate)
      startDate = week[0]
      endDate = week[6]
    } else if (mode === 'month') {
      const weeks = getMonthGrid(anchorDate)
      startDate = weeks[0][0]
      endDate = weeks[weeks.length - 1][6]
    }

    setLoading(true)
    fetchCourtReservations(selectedCourtId, startDate, endDate)
      .then(setReservations)
      .finally(() => setLoading(false))
  }, [selectedCourtId, mode, anchorDate])

  const shiftDate = (days: number) => {
    const [y, m, d] = anchorDate.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    date.setDate(date.getDate() + days)
    setAnchorDate(toLocalISODate(date))
  }

  const goToday = () => setAnchorDate(toLocalISODate(new Date()))

  const reservationsByDate: Record<string, ScheduleReservation[]> = {}
  for (const r of reservations) {
    if (!reservationsByDate[r.date]) reservationsByDate[r.date] = []
    reservationsByDate[r.date].push(r)
  }

  const countsByDate: Record<string, number> = {}
  for (const date in reservationsByDate) {
    countsByDate[date] = reservationsByDate[date].length
  }

  const weekDates = mode === 'week' ? getWeekDates(anchorDate) : []
  const monthWeeks = mode === 'month' ? getMonthGrid(anchorDate) : []
  const currentMonthNum = parseInt(anchorDate.split('-')[1], 10)
  const shiftAmount = mode === 'day' ? 1 : mode === 'week' ? 7 : 30

  const dateLabel = (() => {
    const [y, m, d] = anchorDate.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    if (mode === 'day') {
      return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    }
    if (mode === 'week' && weekDates.length) {
      const [wy, wm, wd] = weekDates[0].split('-').map(Number)
      const [ey, em, ed] = weekDates[6].split('-').map(Number)
      const start = new Date(wy, wm - 1, wd)
      const end = new Date(ey, em - 1, ed)
      return `${start.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}`
    }
    return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
  })()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-semibold text-2xl tracking-wide">Calendario</h1>
        <Link to="/admin" className="text-sm text-arena-lime hover:underline">← Volver a lista</Link>
      </div>
      <p className="text-arena-muted mb-6">Vista visual de reservas por cancha</p>

      <CourtSelector courts={courts} selectedCourtId={selectedCourtId} onChange={setSelectedCourtId} />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ViewModeToggle mode={mode} onChange={setMode} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-shiftAmount)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-arena-line text-arena-muted hover:text-arena-text"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1.5 rounded-md border border-arena-line text-sm text-arena-muted hover:text-arena-text"
          >
            Hoy
          </button>
          <button
            onClick={() => shiftDate(shiftAmount)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-arena-line text-arena-muted hover:text-arena-text"
          >
            ›
          </button>
        </div>
      </div>

      <p className="text-sm text-arena-muted mb-4 capitalize">{dateLabel}</p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-arena-muted">Cargando...</p>
        </div>
      ) : (
        <>
          {mode === 'day' && (
            <DayTimeline reservations={reservationsByDate[anchorDate] ?? []} />
          )}
          {mode === 'week' && (
            <WeekGrid weekDates={weekDates} reservationsByDate={reservationsByDate} />
          )}
          {mode === 'month' && (
            <MonthGrid
              weeks={monthWeeks}
              countsByDate={countsByDate}
              currentMonth={currentMonthNum}
              onSelectDate={(date) => { setAnchorDate(date); setMode('day') }}
            />
          )}
        </>
      )}
    </div>
  )
}

export default AdminCalendar