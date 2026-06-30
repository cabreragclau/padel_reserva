import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

interface ReservationRow {
  id: string
  date: string
  start_time: string
  end_time: string
  courts: { name: string; type: string }
}

function MisReservas() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/login'); return }

    supabase
      .from('reservations')
      .select('id, date, start_time, end_time, courts(name, type)')
      .eq('user_id', user.id)
      .order('date')
      .order('start_time')
      .then(({ data }) => {
        if (data) setReservations(data as unknown as ReservationRow[])
        setLoading(false)
      })
  }, [user, authLoading, navigate])

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (!error) setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-400">Cargando tus reservas...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mis reservas</h1>
      {reservations.length === 0 ? (
        <p className="text-slate-500">Todavía no tienes reservas. Ve a Inicio y reserva un horario.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{r.courts.name}</p>
                <p className="text-sm text-slate-500">
                  {r.date} · {r.start_time.substring(0, 5)} – {r.end_time.substring(0, 5)}
                </p>
              </div>
              <button
                onClick={() => handleCancel(r.id)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MisReservas