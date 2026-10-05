import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../components/ProductCard'

export default function OrderSuccess() {
  const { state } = useLocation()
  const orderId = state?.orderId
  const amount = state?.amount || state?.total
  const itemCount = state?.itemCount
  const email = state?.email
  const phone = state?.phone

  return (
    <div className="ck-container py-20 text-center">
      <p className="ck-badge mx-auto">Success</p>
      <h1 className="mt-4 font-display ck-page-title">Order received</h1>
      <p className="mx-auto mt-4 max-w-xl text-[var(--ck-mute)]">
        Thanks for shopping Champion Kicks
        {orderId ? ` · order pack #${orderId}` : ''}
        {itemCount ? ` · ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}
        {amount ? ` · ${formatPrice(amount)} in products` : ''}.
      </p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--ck-ink)]">
        We will email{email ? ` ${email}` : ' you'} or call{phone ? ` ${phone}` : ' you'} with the
        total to pay, including delivery fees based on your location. Please wait for that message
        before sending money.
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
