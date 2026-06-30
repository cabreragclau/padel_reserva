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
  profiles: { email: string }
}

function Admin() {
  const { user, role, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const today = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
})()
  const [selectedDate, setSelectedDate] = useState(today)
  const [rows, setRows] = useState<AdminReservationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || role !== 'admin') { navigate('/'); return }

    setLoading(true)
    supabase
      .from('reservations')
      .select('id, start_time, end_time, courts(name), profiles(email)')
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
      <p className="text-slate-400">Cargando...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Panel de administrador</h1>
      <p className="text-slate-500 mb-6">Todas las reservas del club por día</p>

      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

      {rows.length === 0 ? (
        <p className="text-slate-500">No hay reservas para este día.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Cancha</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Jugador</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.courts.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.start_time.substring(0, 5)} – {r.end_time.substring(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.profiles?.email ?? 'Usuario eliminado'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
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