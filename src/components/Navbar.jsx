import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { cardTone } from '../lib/ui'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Homepage', end: true },
  { to: '/products', label: 'Our Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

function NavLabel({ link, itemCount }) {
  if (link.to !== '/cart') return link.label
  return (
    <>
      Cart
      {itemCount > 0 && (
        <span className="ck-cart-count" aria-label={`${itemCount} items in cart`}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </>
  )
}

function navClassName(link, isActive, extra = '') {
  const cart = link.to === '/cart' ? 'ck-cart-tab' : ''
  return `nav-link-ck ${cart} ${extra} ${isActive ? 'active' : ''}`.replace(/\s+/g, ' ').trim()
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { itemCount } = useCart()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.toggle('ck-nav-lock', open)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('ck-nav-lock')
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ck-line)] bg-[rgba(247,245,242,0.96)] backdrop-blur-md">
      <div className="ck-container relative z-[60] flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <Link to="/" className="flex min-w-0 shrink-0 items-center" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-auto sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {links.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => navClassName(link, isActive, cardTone(i))}
            >
              <NavLabel link={link} itemCount={itemCount} />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="ck-menu-btn lg:hidden"
          aria-expanded={open}
          aria-controls="ck-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`ck-menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div id="ck-mobile-nav" className={`ck-mobile-overlay lg:hidden ${open ? 'is-open' : ''}`}>
        <button
          type="button"
          className="ck-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <nav className="ck-mobile-panel ck-container" aria-label="Mobile">
          {links.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => navClassName(link, isActive, `ck-mobile-link ${cardTone(i)}`)}
            >
              <NavLabel link={link} itemCount={itemCount} />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
