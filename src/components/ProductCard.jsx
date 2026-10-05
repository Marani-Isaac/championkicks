import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from './Badge'
import QuantityStepper from './QuantityStepper'
import { useCart } from '../context/CartContext'

function formatPrice(value) {
  const n = Number(value) || 0
  return `KES ${n.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

export default function ProductCard({ product, showNewBadge = false, onAdd }) {
  const { items, addItem, adjustItem, startBuyNow } = useCart()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const inStock = product.available !== false && (product.stock ?? 99) > 0
  const max = product.stock ?? 99
  const quantity = items.find((i) => i.id === product.id)?.quantity || 0
  const lineTotal = Number(product.price) * Math.max(quantity, 1)

  const handleAdd = () => {
    if (!inStock) return
    addItem(product, 1)
    onAdd?.(product)
  }

  const handleBuy = () => {
    if (!inStock) return
    const qty = Math.max(quantity, 1)
    if (quantity === 0) addItem(product, 1)
    startBuyNow(product, qty)
    navigate('/checkout')
  }

  const onMove = (e) => {
    const el = cardRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-10px)`
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)'
  }

  return (
    <article
      ref={cardRef}
      className="product-card ck-card-shine group flex h-full flex-col"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-[#ece8e2]">
        <img
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
          }
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {showNewBadge && <Badge>NEW ARRIVAL</Badge>}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="font-display text-lg leading-tight tracking-tight">{product.name}</h3>
        <p className="text-xs font-normal tracking-tight text-[var(--ck-mute)]">
          {product.description || 'Premium Champion Kicks drop.'}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="font-display text-xl tracking-tight">{formatPrice(lineTotal)}</p>
              <p className={`text-xs font-semibold ${inStock ? 'text-[var(--ck-success)]' : 'text-[var(--ck-danger)]'}`}>
                {inStock ? 'Available' : 'Unavailable'}
              </p>
            </div>
            {quantity > 1 && (
              <p className="text-xs text-[var(--ck-mute)]">
                {formatPrice(product.price)} each · {quantity} in cart
              </p>
            )}
          </div>
          <QuantityStepper
            value={quantity}
            min={0}
            max={max}
            disabled={!inStock}
            onDecrease={() => adjustItem(product, -1)}
            onIncrease={() => {
              adjustItem(product, 1)
              onAdd?.(product)
            }}
          />
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              className="ck-btn ck-btn-accent px-3 py-1.5 text-xs"
              disabled={!inStock}
              onClick={handleBuy}
            >
              Buy
            </button>
            <button
              type="button"
              className="ck-btn ck-btn-primary px-3 py-1.5 text-xs"
              disabled={!inStock}
              onClick={handleAdd}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export { formatPrice }
