import { useEffect, useState } from 'react'
import { paymentsApi, unwrapList, normalizePayment } from '../../lib/api'
import { formatPrice } from '../../components/ProductCard'
import { useAuth } from '../../context/AuthContext'

const emptyForm = {
  username: '',
  amount: '',
  product_id: '',
  payment_status: 'completed',
}

export default function AdminPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [form, setForm] = useState({ ...emptyForm, username: user?.username || '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await paymentsApi.getAll()
      setPayments(unwrapList(data, ['payments']).map(normalizePayment).filter(Boolean))
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await paymentsApi.create({
        username: form.username,
        amount: String(form.amount),
        product_id: String(form.product_id),
        payment_status: form.payment_status,
      })
      setForm({ ...emptyForm, username: user?.username || '' })
      setMessage('Payment recorded.')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not add payment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-[var(--ck-accent)]">Payment Tracking</h1>
      <p className="mt-2 text-sm text-[#9a9a9a]">
        Uses <code>POST /api/add_payment</code> and <code>GET /api/get_payments</code>.
      </p>

      <form onSubmit={onSubmit} className="admin-panel mt-6 grid gap-4 p-5 md:grid-cols-2">
        <div>
          <label className="ck-label text-[#aaa]">Username</label>
          <input
            name="username"
            className="ck-input"
            required
            placeholder="e.g. jane_kicks"
            value={form.username}
            onChange={onChange}
          />
          <p className="ck-hint">Customer username as stored on the order.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Product ID</label>
          <input
            name="product_id"
            className="ck-input"
            required
            placeholder="Numeric product ID"
            value={form.product_id}
            onChange={onChange}
          />
          <p className="ck-hint">Use the ID from the products list.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Amount</label>
          <input
            name="amount"
            type="number"
            min="1"
            className="ck-input"
            required
            placeholder="e.g. 4500"
            value={form.amount}
            onChange={onChange}
          />
          <p className="ck-hint">Amount paid in Kenyan shillings.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Status</label>
          <select name="payment_status" className="ck-select" value={form.payment_status} onChange={onChange}>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <p className="ck-hint">Mark completed only after the payment is confirmed.</p>
        </div>
        {error && <p className="md:col-span-2 text-sm text-[var(--ck-danger)]">{error}</p>}
        {message && <p className="md:col-span-2 text-sm text-[var(--ck-success)]">{message}</p>}
        <div className="md:col-span-2">
          <button type="submit" className="ck-btn ck-btn-accent" disabled={saving}>
            {saving ? 'Saving…' : 'Add Payment'}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-[#9a9a9a]">Loading…</p>}
        {payments.map((p) => (
          <div key={p.id} className="admin-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">
                Payment #{p.id} · Product #{p.product_id}
              </p>
              <p className="text-xs text-[#9a9a9a]">
                {p.username} · {p.status}
                {p.created_at ? ` · ${new Date(p.created_at).toLocaleString()}` : ''}
              </p>
            </div>
            <p className="font-display text-2xl">{formatPrice(p.amount)}</p>
          </div>
        ))}
        {!loading && payments.length === 0 && (
          <p className="text-sm text-[#9a9a9a]">No payment records yet.</p>
        )}
      </div>
    </div>
  )
}
