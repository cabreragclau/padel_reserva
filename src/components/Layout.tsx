import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Layout() {
  const location = useLocation()
  const { user, role, signOut } = useAuth()

  const links = [
    { path: '/', label: 'Inicio' },
    { path: '/mis-reservas', label: 'Mis reservas' },
    ...(role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex gap-6">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
                <button onClick={signOut} className="text-sm text-slate-500 hover:text-slate-900">
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={
                  location.pathname === '/login'
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }
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