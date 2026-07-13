import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [resetSent, setResetSent] = useState(false)
  const {signIn, signUp, resetPassword} = useAuth()

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

  const handleForgotPassword = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)
  const { error } = await resetPassword(email)
  setLoading(false)
  if (error) {
    setError(error)
  } else {
    setResetSent(true)
  }
}

if (mode === 'forgot') {
  if (resetSent) {
    return (
      <div className="max-w-sm mx-auto px-6 py-10 text-center">
        <div className="text-4xl mb-4">📬</div>
        <h1 className="font-display font-semibold text-2xl tracking-wide mb-3">
          Revisa tu correo
        </h1>
        <p className="text-arena-muted text-sm mb-6">
          Te enviamos un link para restablecer tu contraseña a{' '}
          <strong className="text-arena-text">{email}</strong>.
        </p>
        <button
          onClick={() => { setMode('login'); setResetSent(false) }}
          className="text-arena-lime text-sm hover:underline"
        >
          Volver al login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-10">
      <h1 className="font-display font-semibold text-2xl tracking-wide mb-2">
        Recuperar contraseña
      </h1>
      <p className="text-arena-muted text-sm mb-6">
        Ingresa tu correo y te enviamos un link para crear una nueva contraseña.
      </p>
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-arena-muted mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-arena-line bg-arena-surface px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
            placeholder="tu@correo.com"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-arena-lime text-arena-bg rounded-md py-2 font-display font-medium hover:bg-arena-lime/90 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar link de recuperación'}
        </button>
      </form>
      <button
        onClick={() => setMode('login')}
        className="mt-4 text-sm text-arena-lime hover:underline"
      >
        Volver al login
      </button>
    </div>
  )
}

  return (
    <div className="max-w-sm mx-auto px-6 py-10">
      <h1 className="font-display font-semibold text-2xl tracking-wide mb-6">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-arena-muted mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-arena-line bg-arena-surface px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-arena-muted mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-arena-line bg-arena-surface px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-arena-lime text-arena-bg rounded-md py-2 font-display font-medium hover:bg-arena-lime/90 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
      <button
        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
        className="mt-4 text-sm text-arena-lime hover:underline"
      >
        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
        {mode === 'login' && (
      <button
        type="button"
        onClick={() => { setMode('forgot'); setError(null) }}
        className="text-xs text-arena-muted hover:text-arena-lime"
     >
        ¿Olvidaste tu contraseña?
     </button>
  )}
    </div>
  )
}

export default Login