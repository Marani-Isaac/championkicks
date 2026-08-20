import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../lib/api'
import { formatPrice } from '../components/ProductCard'

export default function Checkout() {
  const { checkoutItems, checkoutSubtotal, isBuyNow, clearCart, clearBuyNow } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: 'Nairobi',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  if (checkoutItems.length === 0) {
    return (
      <div className="ck-container py-16 text-center">
        <h1 className="font-display text-5xl">Checkout</h1>
        <p className="mt-3 text-[var(--ck-mute)]">Your cart is empty.</p>
        <Link to="/products" className="ck-btn ck-btn-primary mt-6">
          Shop products
        </Link>
      </div>
    )
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/checkout' } })
      return
    }

    setSubmitting(true)
    setError('')
    try {
      // Backend add_order accepts one product_id + quantity per request
      for (let i = 0; i < checkoutItems.length; i += 1) {
        const item = checkoutItems[i]
        setProgress(`Placing item ${i + 1} of ${checkoutItems.length}…`)
        await ordersApi.create({
          product_id: item.id,
          quantity: String(item.quantity),
        })
      }

      const primary = checkoutItems[0]
      sessionStorage.setItem(
        'ck_last_order',
        JSON.stringify({
          product_id: primary.id,
          product_name: primary.name,
          total: checkoutSubtotal,
          items: checkoutItems,
          shipping: form,
          username: user?.username,
        }),
      )
      if (isBuyNow) clearBuyNow()
      else clearCart()
      navigate('/payment', {
        state: {
          productId: primary.id,
          total: checkoutSubtotal,
          username: user?.username,
        },
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not place order')
    } finally {
      setSubmitting(false)
      setProgress('')
    }
  }

  return (
    <div className="ck-container py-10">
      <h1 className="font-display text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-[var(--ck-mute)]">
        {isBuyNow
          ? `Buying this item only · ${formatPrice(checkoutSubtotal)}.`
          : `Enter shipping details and submit your order (${formatPrice(checkoutSubtotal)}).`}
      </p>

      {!isAuthenticated && (
        <p className="mt-4 rounded-2xl border border-[var(--ck-line)] bg-white/70 p-3 text-sm">
          You need an account to place an order.{' '}
          <Link to="/signin" className="font-semibold underline">
            Sign in
          </Link>{' '}
          or{' '}
          <Link to="/signup" className="font-semibold underline">
            create one
          </Link>
          .
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="ck-card-surface space-y-4 p-5">
          <h2 className="font-display text-3xl">Shipping</h2>
          {[
            ['fullName', 'Full name', 'text', 'As it appears on your ID', 'Recipient name for delivery.'],
            ['phone', 'Phone', 'tel', 'e.g. 0727 091 597', 'A reachable Kenyan mobile number.'],
            ['email', 'Email', 'email', 'e.g. jane@email.com', 'For order confirmation and receipts.'],
            ['address', 'Address', 'text', 'Building, street, estate', 'Include a landmark if the street is hard to find.'],
            ['city', 'City', 'text', 'e.g. Nairobi or Eldoret', 'City of the delivery address.'],
          ].map(([name, label, type, placeholder, hint]) => (
            <div key={name}>
              <label className="ck-label" htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                className="ck-input"
                required
                placeholder={placeholder}
                value={form[name]}
                onChange={onChange}
              />
              <p className="ck-hint">{hint}</p>
            </div>
          ))}
          <div>
            <label className="ck-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="ck-textarea"
              rows={3}
              placeholder="Gate code, landmark, preferred size notes…"
              value={form.notes}
              onChange={onChange}
            />
            <p className="ck-hint">Optional. Helps our rider find you faster.</p>
          </div>
        </div>

        <div className="ck-card-surface ck-card-ink h-fit p-5">
          <h2 className="font-display text-3xl">{isBuyNow ? 'Buy now' : 'Order'}</h2>
          {isBuyNow && (
            <p className="mt-1 text-xs text-[var(--ck-mute)]">Other cart items are left untouched.</p>
          )}
          <ul className="mt-4 space-y-3 text-sm">
            {checkoutItems.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-[var(--ck-line)] pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(checkoutSubtotal)}</span>
          </div>
          {progress && <p className="mt-3 text-sm text-[var(--ck-mute)]">{progress}</p>}
          {error && <p className="mt-3 text-sm text-[var(--ck-danger)]">{error}</p>}
          <button type="submit" className="ck-btn ck-btn-accent mt-6 w-full" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  )
}
