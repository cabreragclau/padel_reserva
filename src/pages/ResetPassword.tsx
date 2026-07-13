import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto px-6 py-10 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="font-display font-semibold text-2xl tracking-wide mb-3">
          Contraseña actualizada
        </h1>
        <p className="text-arena-muted text-sm">Te estamos redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-10">
      <h1 className="font-display font-semibold text-2xl tracking-wide mb-6">
        Crear nueva contraseña
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-arena-muted mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-arena-line bg-arena-surface px-3 py-2 text-sm text-arena-text focus:outline-none focus:ring-2 focus:ring-arena-lime/50"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-arena-muted mb-1">Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword