import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../components/ProductCard'

export default function OrderSuccess() {
  const { state } = useLocation()
  const productId = state?.productId
  const amount = state?.amount
  const method = state?.method

  return (
    <div className="ck-container py-20 text-center">
      <p className="ck-badge mx-auto">Success</p>
      <h1 className="mt-4 font-display text-6xl tracking-wide">Order confirmed</h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--ck-mute)]">
        Thanks for shopping Champion Kicks.
        {productId ? ` Product #${productId}` : ''}
        {amount ? ` · ${formatPrice(amount)}${method ? ` (${method})` : ''}` : ''}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/products" className="ck-btn ck-btn-primary">
          Continue shopping
        </Link>
        <Link to="/" className="ck-btn ck-btn-outline">
          Back home
        </Link>
      </div>
    </div>
  )
}
