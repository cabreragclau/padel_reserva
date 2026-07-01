import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Layout() {
  const location = useLocation()
  const { user, role, signOut } = useAuth()

  const links = [
    { path: '/', label: 'Reservar' },
    { path: '/tablon', label: 'Tablón' },
    { path: '/mis-reservas', label: 'Mis reservas' },
    ...(role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <div className="min-h-screen bg-arena-bg">
      <nav className="border-b border-arena-line px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-lg tracking-wide">
            ARENA <span className="text-arena-lime">PADEL</span>
          </Link>

          <div className="flex items-center gap-6">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-arena-lime'
                    : 'text-arena-muted hover:text-arena-text'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={signOut}
                className="text-sm text-arena-muted hover:text-arena-text"
              >
                Salir
              </button>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium ${
                  location.pathname === '/login'
                    ? 'text-arena-lime'
                    : 'text-arena-muted hover:text-arena-text'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout