import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../components/ProductCard'
import QuantityStepper from '../components/QuantityStepper'
import { cardTone } from '../lib/ui'
import { isCartItemAvailable } from '../lib/format'

export default function Cart() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    itemCount,
    clearBuyNow,
    unavailableItems,
    hasUnavailable,
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="ck-container py-16 text-center">
        <h1 className="font-display ck-page-title">Your Cart</h1>
        <p className="mt-3 text-[var(--ck-mute)]">No items yet — time to lace up.</p>
        <Link to="/products" className="ck-btn ck-btn-primary mt-6">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="ck-container py-10">
      <h1 className="font-display ck-page-title">Your Cart</h1>
      <p className="mt-2 text-sm text-[var(--ck-mute)]">{itemCount} item(s)</p>

      {hasUnavailable && (
        <div
          className="mt-5 rounded-2xl border border-[var(--ck-danger)] bg-[#d64545] px-4 py-3 text-sm text-white"
          role="alert"
        >
          {unavailableItems.length === 1
            ? `${unavailableItems[0].name} is unavailable. Remove it before checkout.`
            : `${unavailableItems.length} items in your cart are unavailable. Remove them before checkout.`}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item, i) => {
            const available = isCartItemAvailable(item)
            return (
              <div
                key={item.id}
                className={`ck-card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${cardTone(i)}`}
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
                  {available ? (
                    <p className="mt-1 text-xs font-semibold text-[var(--ck-success)]">Available</p>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-[var(--ck-danger)]">
                      Unavailable — this item cannot be checked out.
                    </p>
                  )}
                  <div className="mt-3 flex max-w-xs flex-col gap-2 sm:max-w-[12rem]">
                    <QuantityStepper
                      value={item.quantity}
                      min={0}
                      max={item.stock ?? 99}
                      disabled={!available}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                    <button
                      type="button"
                      className="text-left text-sm font-medium text-[var(--ck-danger)]"
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
            )
          })}
        </div>

        <aside className="ck-card-surface h-fit p-5">
          <h2 className="font-display text-3xl">Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-[var(--ck-mute)]">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--ck-mute)]">Shipping calculated at checkout.</p>
          {hasUnavailable ? (
            <button type="button" className="ck-btn ck-btn-accent mt-6 w-full" disabled>
              Remove unavailable items to checkout
            </button>
          ) : (
            <Link to="/checkout" className="ck-btn ck-btn-accent mt-6 w-full" onClick={clearBuyNow}>
              Proceed to Checkout
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
