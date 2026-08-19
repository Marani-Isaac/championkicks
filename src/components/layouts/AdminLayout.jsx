import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../Logo'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/testimonials', label: 'Testimonials' },
]

export default function AdminLayout() {
  const { user, signout } = useAuth()

  return (
    <div className="admin-shell">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-white/10 p-5 lg:w-64 lg:border-b-0 lg:border-r">
          <Link to="/" className="inline-block">
            <Logo className="h-12 w-auto" />
          </Link>
          <p className="mt-2 font-display text-lg tracking-wide text-[var(--ck-accent)]">Admin</p>
          <p className="mt-1 text-xs text-[#8a8a8a]">{user?.email || 'Administrator'}</p>
          <nav className="mt-8 flex flex-row flex-wrap gap-2 lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-white/10 text-[var(--ck-accent)]' : 'text-[#cfcfcf] hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 flex gap-2">
            <Link to="/" className="ck-btn ck-btn-outline border-white/30 px-3 py-2 text-xs text-white">
              Storefront
            </Link>
            <button
              type="button"
              className="ck-btn ck-btn-accent px-3 py-2 text-xs"
              onClick={signout}
            >
              Sign Out
            </button>
          </div>
        </aside>
        <section className="flex-1 p-5 lg:p-8">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
