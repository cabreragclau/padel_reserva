import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import DateSelector from '../components/DateSelector'

interface AdminReservationRow {
  id: string
  start_time: string
  end_time: string
  courts: { name: string }
  profiles: { email: string } | null
}

function Admin() {
  const { user, role, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [rows, setRows] = useState<AdminReservationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || role !== 'admin') { navigate('/'); return }

    setLoading(true)
    supabase
      .from('reservations')
      .select('id, start_time, end_time, courts(name), profiles!reservations_user_id_fkey(email)')
      .eq('date', selectedDate)
      .order('start_time')
      .then(({ data }) => {
        if (data) setRows(data as unknown as AdminReservationRow[])
        setLoading(false)
      })
  }, [user, role, authLoading, navigate, selectedDate])

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (!error) setRows((prev) => prev.filter((r) => r.id !== id))
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-arena-muted">Cargando...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display font-semibold text-2xl tracking-wide mb-1">Panel de administrador</h1>
      <p className="text-arena-muted mb-6">Todas las reservas del club por día</p>

      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

      {rows.length === 0 ? (
        <p className="text-arena-muted">No hay reservas para este día.</p>
      ) : (
        <div className="bg-arena-surface rounded-xl border border-arena-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-arena-bg text-arena-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Cancha</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Jugador</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-line">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-display font-medium tracking-wide">{r.courts.name}</td>
                  <td className="px-4 py-3 text-arena-muted">
                    {r.start_time.substring(0, 5)} – {r.end_time.substring(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-arena-muted">{r.profiles?.email ?? 'Usuario eliminado'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin