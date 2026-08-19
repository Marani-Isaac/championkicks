import { useEffect, useState } from 'react'
import { ordersApi, unwrapList, normalizeOrder } from '../../lib/api'
import { formatPrice } from '../../components/ProductCard'
import Badge from '../../components/Badge'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await ordersApi.getAll()
        if (!active) return
        setOrders(unwrapList(data, ['orders']).map(normalizeOrder).filter(Boolean))
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || 'Failed to load orders')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-[var(--ck-accent)]">Order Management</h1>
      <p className="mt-2 text-sm text-[#9a9a9a]">From <code>GET /api/get_orders</code>.</p>

      {loading && <p className="mt-6 text-sm text-[#9a9a9a]">Loading orders…</p>}
      {error && <p className="mt-6 text-sm text-[var(--ck-danger)]">{error}</p>}

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="admin-panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Order #{order.id} · {order.product_name || `Product #${order.product_id}`}
                </p>
                <p className="text-xs text-[#9a9a9a]">
                  Qty {order.quantity}
                  {order.created_at ? ` · ${new Date(order.created_at).toLocaleString()}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl">{formatPrice(order.total_amount)}</span>
                <Badge variant="muted">{order.status}</Badge>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && orders.length === 0 && (
        <p className="mt-6 text-sm text-[#9a9a9a]">No orders found.</p>
      )}
    </div>
  )
}
