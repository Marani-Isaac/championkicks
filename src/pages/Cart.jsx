import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../components/ProductCard'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem, itemCount, clearBuyNow } = useCart()

  if (items.length === 0) {
    return (
      <div className="ck-container py-16 text-center">
        <h1 className="font-display text-5xl">Your Cart</h1>
        <p className="mt-3 text-[var(--ck-mute)]">No items yet — time to lace up.</p>
        <Link to="/products" className="ck-btn ck-btn-primary mt-6">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="ck-container py-10">
      <h1 className="font-display text-5xl">Your Cart</h1>
      <p className="mt-2 text-sm text-[var(--ck-mute)]">{itemCount} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="ck-card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={
                  item.image_url ||
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80'
                }
                alt={item.name}
                className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-[var(--ck-mute)]">{formatPrice(item.price)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ck-mute)]">
                    Qty
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={item.stock ?? 99}
                    value={item.quantity}
                    className="ck-input w-20"
                    placeholder="1"
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                  />
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--ck-danger)]"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-display text-2xl">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <aside className="ck-card-surface h-fit p-5">
          <h2 className="font-display text-3xl">Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-[var(--ck-mute)]">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--ck-mute)]">Shipping calculated at checkout.</p>
          <Link to="/checkout" className="ck-btn ck-btn-accent mt-6 w-full" onClick={clearBuyNow}>
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
