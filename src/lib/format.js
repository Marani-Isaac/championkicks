export function isProductAvailable(value) {
  if (value === true || value === 1 || value === '1') return true
  if (value === false || value === 0 || value === '0') return false
  if (value == null || value === '') return true
  const text = String(value).trim().toLowerCase()
  if (['false', 'unavailable', 'out_of_stock', 'no', '0.0', '0.00'].includes(text)) return false
  if (['true', 'available', 'yes', 'in_stock'].includes(text)) return true
  const numeric = Number(text)
  if (!Number.isNaN(numeric)) return numeric !== 0
  return true
}

export function isCartItemAvailable(item) {
  if (!item) return false
  if (item.available === false) return false
  if ((item.stock ?? 99) <= 0) return false
  return true
}
