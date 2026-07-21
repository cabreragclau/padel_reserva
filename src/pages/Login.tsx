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
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()

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

    const handleGoogleLogin = async () => {
      setError(null)
      const { error } = await signInWithGoogle()
      if (error) setError(error)
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
      <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-2 border border-arena-line bg-arena-surface text-arena-text rounded-md py-2 font-medium text-sm hover:border-arena-lime/40 transition-colors mb-4"
>
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
  Continuar con Google
</button>

<div className="flex items-center gap-3 mb-4">
  <div className="flex-1 h-px bg-arena-line"></div>
  <span className="text-xs text-arena-muted">o</span>
  <div className="flex-1 h-px bg-arena-line"></div>
</div>
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