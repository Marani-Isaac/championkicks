export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'ck-badge',
    muted: 'ck-badge ck-badge-muted',
    danger: 'ck-badge ck-badge-danger',
    success: 'ck-badge ck-badge-success',
  }

  return <span className={`${variants[variant] || variants.default} ${className}`}>{children}</span>
}
