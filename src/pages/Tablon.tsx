import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import DateSelector from '../components/DateSelector'

interface PlayerPost {
  id: string
  date: string
  start_time: string
  level: string
  message: string | null
  created_at: string
  profiles: { email: string } | null
}

const LEVELS = [
  '1ra', '2da', '3ra', '4ta', '5ta', '6ta',
  'Damas D', 'Damas C', 'Damas B', 'Damas A',
  'Mixtos',
] as const

type Level = typeof LEVELS[number]

const LEVEL_COLORS: Record<Level, string> = {
  '1ra':     'text-arena-lime bg-arena-lime-dim border-arena-lime/30',
  '2da':     'text-arena-lime bg-arena-lime-dim border-arena-lime/30',
  '3ra':     'text-yellow-400 bg-yellow-950/40 border-yellow-900',
  '4ta':     'text-yellow-400 bg-yellow-950/40 border-yellow-900',
  '5ta':     'text-orange-400 bg-orange-950/40 border-orange-900',
  '6ta':     'text-orange-400 bg-orange-950/40 border-orange-900',
  'Damas D': 'text-pink-400 bg-pink-950/40 border-pink-900',
  'Damas C': 'text-pink-400 bg-pink-950/40 border-pink-900',
  'Damas B': 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-900',
  'Damas A': 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-900',
  'Mixtos':  'text-sky-400 bg-sky-950/40 border-sky-900',
}

function getTodayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

function Tablon() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PlayerPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(getTodayLocal())

  // Form state
  const [formDate, setFormDate] = useState(getTodayLocal())
  const [formTime, setFormTime] = useState('10:00')
  const [formLevel, setFormLevel] = useState<Level>('3ra')
  const [formMessage, setFormMessage] = useState('')
  const [posting, setPosting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const loadPosts = async (date: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('player_posts')
      .select('id, date, start_time, level, message, created_at, profiles(email)')
      .eq('date', date)
      .order('start_time')
    if (data) setPosts(data as unknown as PlayerPost[])
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/login'); return }
    loadPosts(selectedDate)
  }, [user, authLoading, selectedDate, navigate])

  

  const handlePost = async () => {
    if (!user) return
    setPosting(true)
    const { error } = await supabase.from('player_posts').insert({
      user_id: user.id,
      date: formDate,
      start_time: formTime,
      level: formLevel,
      message: formMessage || null,
    })
    setPosting(false)
    if (!error) {
      setShowForm(false)
      setFormMessage('')
      loadPosts(selectedDate)
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('player_posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-arena-lime text-xs font-medium uppercase tracking-widest mb-2">
          Comunidad
        </p>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-semibold text-3xl tracking-wide mb-1">
              Tablón de jugadores
            </h1>
            <p className="text-arena-muted">Busca compañeros para tu próxima pista</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="shrink-0 bg-arena-lime text-arena-bg px-4 py-2 rounded-md font-display font-medium hover:bg-arena-lime/90"
          >
            {showForm ? 'Cancelar' : '+ Publicar'}
          </button>
        </div>

        {showForm && (
          <div className="bg-arena-surface border border-arena-lime/30 rounded-xl p-5 mb-6 space-y-4">
            <h2 className="font-display font-medium tracking-wide">Nueva publicación</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-arena-muted uppercase tracking-widest mb-1">Fecha</label>
                <input
                  type="date"
                  value={formDate}
                  min={getTodayLocal()}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-md border border-arena-line bg-arena-bg px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs text-arena-muted uppercase tracking-widest mb-1">Hora</label>
                <select
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full rounded-md border border-arena-line bg-arena-bg px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
                >
                  {Array.from({ length: 15 }, (_, i) => {
                    const h = (8 + i).toString().padStart(2, '0')
                    return `${h}:00`
                  }).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
                <label className="block text-xs text-arena-muted uppercase tracking-widest mb-2">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setFormLevel(l)}
                    className={`px-3 py-1.5 rounded-md text-sm font-display font-medium border transition-colors ${
                      formLevel === l ? LEVEL_COLORS[l] : 'text-arena-muted border-arena-line hover:text-arena-text'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-arena-muted uppercase tracking-widest mb-1">Mensaje (opcional)</label>
              <input
                type="text"
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="ej: busco 1 jugador para dobles"
                className="w-full rounded-md border border-arena-line bg-arena-bg px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
              />
            </div>
            <button
              onClick={handlePost}
              disabled={posting}
              className="bg-arena-lime text-arena-bg px-4 py-2 rounded-md font-display font-medium hover:bg-arena-lime/90 disabled:opacity-50"
            >
              {posting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        )}

        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-arena-muted">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-arena-line rounded-xl">
            <p className="text-arena-muted text-sm">No hay publicaciones para este día.</p>
            <p className="text-arena-muted text-sm mt-1">¡Sé el primero en buscar compañeros!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-arena-surface border border-arena-line rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-medium tracking-wide">
                        {post.start_time.substring(0, 5)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${LEVEL_COLORS[post.level as Level]}`}>
                        {post.level}
                      </span>
                    </div>
                    {post.message && (
                      <p className="text-sm text-arena-muted">{post.message}</p>
                    )}
                    <p className="text-xs text-arena-muted/60">{post.profiles?.email}</p>
                  </div>
                  {post.profiles?.email === user?.email && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-red-400 hover:text-red-300 shrink-0"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tablon