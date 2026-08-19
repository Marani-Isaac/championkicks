import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { paymentsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../components/ProductCard'

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const lastOrder = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('ck_last_order') || 'null')
    } catch {
      return null
    }
  }, [])

  const productId = state?.productId || lastOrder?.product_id || ''
  const total = state?.total || lastOrder?.total || 0
  const username = state?.username || lastOrder?.username || user?.username || ''

  const [form, setForm] = useState({
    username: username || '',
    amount: total || '',
    product_id: productId || '',
    payment_status: 'completed',
    phone: user?.phone || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [mpesaBusy, setMpesaBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/payment' } })
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await paymentsApi.create({
        username: form.username,
        amount: String(form.amount),
        product_id: String(form.product_id),
        payment_status: form.payment_status,
      })
      navigate('/order-success', {
        state: {
          productId: form.product_id,
          amount: form.amount,
          method: form.payment_status,
        },
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment could not be recorded')
    } finally {
      setSubmitting(false)
    }
  }

  const onMpesa = async () => {
    setMpesaBusy(true)
    setError('')
    setInfo('')
    try {
      const { data } = await paymentsApi.mpesa({
        amount: String(form.amount || 1),
        phone: form.phone,
      })
      setInfo(data.message || 'Check your phone to complete M-Pesa payment.')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'M-Pesa request failed')
    } finally {
      setMpesaBusy(false)
    }
  }

  return (
    <div className="ck-container py-10">
      <h1 className="font-display text-5xl">Make Payment</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--ck-mute)]">
        Record payment against product #{productId || '—'} · due{' '}
        <strong>{formatPrice(total)}</strong>
      </p>

      <form onSubmit={onSubmit} className="ck-card-surface mt-8 max-w-lg space-y-4 p-5">
        <div>
          <label className="ck-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="ck-input"
            required
            placeholder="e.g. jane_kicks"
            value={form.username}
            onChange={onChange}
          />
          <p className="ck-hint">Must match the account that placed the order.</p>
        </div>
        <div>
          <label className="ck-label" htmlFor="product_id">
            Product ID
          </label>
          <input
            id="product_id"
            name="product_id"
            className="ck-input"
            required
            placeholder="Filled from your last order"
            value={form.product_id}
            onChange={onChange}
          />
          <p className="ck-hint">Leave as filled unless you are paying for a different item.</p>
        </div>
        <div>
          <label className="ck-label" htmlFor="amount">
            Amount (KES)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            className="ck-input"
            required
            placeholder="e.g. 4500"
            value={form.amount}
            onChange={onChange}
          />
          <p className="ck-hint">Enter the order total in Kenyan shillings, numbers only.</p>
        </div>
        <div>
          <label className="ck-label" htmlFor="payment_status">
            Payment status
          </label>
          <select
            id="payment_status"
            name="payment_status"
            className="ck-select"
            value={form.payment_status}
            onChange={onChange}
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <p className="ck-hint">Choose Completed after you finish paying.</p>
        </div>
        <div>
          <label className="ck-label" htmlFor="phone">
            M-Pesa phone
          </label>
          <input
            id="phone"
            name="phone"
            className="ck-input"
            value={form.phone}
            onChange={onChange}
            placeholder="2547XXXXXXXX"
          />
          <p className="ck-hint">Use 2547… format, no spaces — the STK prompt will go to this number.</p>
        </div>
        {info && <p className="text-sm text-[var(--ck-success)]">{info}</p>}
        {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}
        <button type="submit" className="ck-btn ck-btn-accent w-full" disabled={submitting}>
          {submitting ? 'Saving…' : 'Record payment'}
        </button>
        <button
          type="button"
          className="ck-btn ck-btn-primary w-full"
          disabled={mpesaBusy || !form.phone}
          onClick={onMpesa}
        >
          {mpesaBusy ? 'Sending STK…' : 'Pay with M-Pesa STK'}
        </button>
        <Link to="/cart" className="block text-center text-sm text-[var(--ck-mute)]">
          Back to cart
        </Link>
      </form>
    </div>
  )
}
