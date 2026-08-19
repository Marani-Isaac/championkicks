import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Homepage', end: true },
  { to: '/products', label: 'Our Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ck-line)] bg-[rgba(247,245,242,0.92)] backdrop-blur-md">
      <div className="ck-container flex flex-wrap items-center justify-between gap-y-3 py-3">
        <Link to="/" className="flex shrink-0 items-center">
          <Logo className="h-11 w-auto" />
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link-ck ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
