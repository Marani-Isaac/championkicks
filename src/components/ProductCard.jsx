import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from './Badge'
import { getCategoryLabel } from '../lib/categories'
import { useCart } from '../context/CartContext'

function formatPrice(value) {
  const n = Number(value) || 0
  return `KES ${n.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

export default function ProductCard({ product, showNewBadge = false, onAdd }) {
  const { addItem, startBuyNow } = useCart()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const inStock = (product.stock ?? 99) > 0

  const handleAdd = () => {
    if (!inStock) return
    addItem(product, 1)
    onAdd?.(product)
  }

  const handleBuy = () => {
    if (!inStock) return
    startBuyNow(product, 1)
    navigate('/checkout')
  }

  const onMove = (e) => {
    const el = cardRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
          {product.category && <Badge variant="muted">{getCategoryLabel(product.category)}</Badge>}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="font-display text-lg leading-tight tracking-tight">{product.name}</h3>
        <p className="line-clamp-1 text-xs font-normal tracking-tight text-[var(--ck-mute)]">
          {product.description || 'Premium Champion Kicks drop.'}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl tracking-tight">{formatPrice(product.price)}</p>
            <p className={`text-xs font-semibold ${inStock ? 'text-[var(--ck-success)]' : 'text-[var(--ck-danger)]'}`}>
              {inStock ? 'Available' : 'Out of stock'}
            </p>
          </div>
          <div className="flex min-w-[7rem] flex-col gap-1.5">
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
            <Link to="/cart" className="ck-btn ck-btn-outline px-3 py-1.5 text-xs">
              View Cart
            </Link>
          </div>
        </div>
        <Link
          to={`/products?highlight=${product.id}`}
          className="pt-0.5 text-xs font-semibold tracking-tight text-[var(--ck-mute)] underline-offset-4 hover:text-[var(--ck-ink)] hover:underline"
        >
          View details →
        </Link>
      </div>
    </article>
  )
}

export { formatPrice }
