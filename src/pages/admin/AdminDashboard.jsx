import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const cards = [
    { to: '/admin/products', title: 'Products', desc: 'Add inventory via multipart form + image.' },
    { to: '/admin/orders', title: 'Orders', desc: 'View customer orders from the database.' },
    { to: '/admin/payments', title: 'Payments', desc: 'Record offline / verified payments.' },
    { to: '/admin/testimonials', title: 'Testimonials', desc: 'Review and publish customer reviews.' },
  ]

  return (
    <div>
      <h1 className="font-display text-5xl tracking-wide text-[var(--ck-accent)]">Admin Overview</h1>
      <p className="mt-2 text-sm text-[#9a9a9a]">
        Connected to championkicks_backend · signed in as {user?.username || user?.email || 'user'}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="admin-panel block p-5 transition hover:border-[var(--ck-accent)]"
          >
            <h2 className="font-display text-3xl">{card.title}</h2>
            <p className="mt-2 text-sm text-[#9a9a9a]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
