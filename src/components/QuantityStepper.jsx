export default function QuantityStepper({
  value,
  min = 0,
  max = 99,
  disabled = false,
  onDecrease,
  onIncrease,
  label = 'Quantity',
}) {
  return (
    <div className="ck-qty" role="group" aria-label={label}>
      <button
        type="button"
        className="ck-qty-btn"
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        onClick={onDecrease}
      >
        −
      </button>
      <span className="ck-qty-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="ck-qty-btn"
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  )
}
