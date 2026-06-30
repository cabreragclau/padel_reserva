import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (error) {
      setError(error)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
      <button
        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
        className="mt-4 text-sm text-emerald-600 hover:underline"
      >
        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  )
}

export default Login