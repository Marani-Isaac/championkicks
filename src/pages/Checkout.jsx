import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../lib/api'
import { formatPrice } from '../components/ProductCard'
import DeliveryMapPicker from '../components/DeliveryMapPicker'
import { mapsSearchUrl } from '../lib/company'

export default function Checkout() {
  const { checkoutItems, checkoutSubtotal, isBuyNow, clearCart, clearBuyNow, hasUnavailableCheckout, unavailableCheckoutItems } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: 'Nairobi',
    notes: '',
    mapQuery: user?.address || '',
    mapLat: '',
    mapLng: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  if (checkoutItems.length === 0) {
    return (
      <div className="ck-container py-16 text-center">
        <h1 className="font-display ck-page-title">Checkout</h1>
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

    if (hasUnavailableCheckout) {
      setError('Remove unavailable items from your cart before placing the order.')
      return
    }

    if (!form.mapQuery.trim()) {
      setError('Add a Google Maps delivery location so we can find you.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      setProgress('Submitting your order pack…')
      const deliveryAddress = [
        form.address,
        form.city,
        form.mapQuery,
        form.mapLat && form.mapLng ? `${form.mapLat},${form.mapLng}` : '',
      ]
        .filter(Boolean)
        .join(' | ')
        .slice(0, 255)

      const { data } = await ordersApi.create({
        items: JSON.stringify(
          checkoutItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        ),
        user_id: user?.user_id != null ? String(user.user_id) : '',
        username: form.fullName || user?.username || '',
        email: form.email || user?.email || '',
        phone: form.phone || user?.phone || '',
        address: deliveryAddress || user?.address || '',
        notes: form.notes || '',
      })
      const lastOrderId = data?.pack_id || data?.order_id || ''

      const primary = checkoutItems[0]
      sessionStorage.setItem(
        'ck_last_order',
        JSON.stringify({
          product_id: primary.id,
          product_name: primary.name,
          total: checkoutSubtotal,
          items: checkoutItems,
          shipping: {
            ...form,
            mapsUrl: mapsSearchUrl(form.mapQuery),
          },
          username: user?.username,
          order_id: lastOrderId,
          pack_id: lastOrderId,
        }),
      )
      if (isBuyNow) clearBuyNow()
      else clearCart()
      navigate('/order-success', {
        state: {
          orderId: lastOrderId,
          productId: primary.id,
          total: checkoutSubtotal,
          itemCount: checkoutItems.length,
          email: form.email || user?.email || '',
          phone: form.phone || user?.phone || '',
        },
      })
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Could not place order',
      )
    } finally {
      setSubmitting(false)
      setProgress('')
    }
  }

  return (
    <div className="ck-container py-10">
      <h1 className="font-display ck-page-title">Checkout</h1>
      <p className="mt-2 text-sm text-[var(--ck-mute)]">
        {isBuyNow
          ? `Buying this item only · ${formatPrice(checkoutSubtotal)}.`
          : `Enter shipping details and submit your order (${formatPrice(checkoutSubtotal)}).`}
      </p>

      {hasUnavailableCheckout && (
        <div
          className="mt-5 rounded-2xl border border-[var(--ck-danger)] bg-[#d64545] px-4 py-3 text-sm text-white"
          role="alert"
        >
          {unavailableCheckoutItems.map((item) => item.name).join(', ')}{' '}
          {unavailableCheckoutItems.length === 1 ? 'is' : 'are'} unavailable.{' '}
          <Link to="/cart" className="font-semibold underline">
            Return to cart
          </Link>{' '}
          and remove {unavailableCheckoutItems.length === 1 ? 'it' : 'them'} before checkout.
        </div>
      )}

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
          <DeliveryMapPicker
            value={{ query: form.mapQuery, lat: form.mapLat, lng: form.mapLng }}
            onChange={(next) =>
              setForm((f) => ({
                ...f,
                mapQuery: next.query,
                mapLat: next.lat,
                mapLng: next.lng,
              }))
            }
          />
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
          <p className="mt-2 text-xs text-[var(--ck-mute)]">
            Item total now. Delivery is added after we confirm your location. We will email or call
            you to pay the full amount.
          </p>
          {progress && <p className="mt-3 text-sm text-[var(--ck-mute)]">{progress}</p>}
          {error && <p className="mt-3 text-sm text-[var(--ck-danger)]">{error}</p>}
          <button
            type="submit"
            className="ck-btn ck-btn-accent mt-6 w-full"
            disabled={submitting || hasUnavailableCheckout}
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  )
}
