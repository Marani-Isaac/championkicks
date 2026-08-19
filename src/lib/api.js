import axios from 'axios'

/** Same-origin `/api` goes through the Vite proxy to 127.0.0.1:5000 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
})

/** Build multipart/form-data for backend routes that use request.form / request.files */
export function toFormData(fields = {}) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    fd.append(key, value)
  })
  return fd
}

export function unwrapList(payload, keys = []) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key]
  }
  return []
}

export function productImageUrl(imageName) {
  if (!imageName) return ''
  if (/^https?:\/\//i.test(imageName)) return imageName
  return `${API_ORIGIN}/static/images/${imageName}`
}

/** Map backend product row → storefront/admin UI shape */
export function normalizeProduct(row) {
  if (!row) return null
  return {
    id: row.product_id ?? row.id,
    product_id: row.product_id ?? row.id,
    name: row.product_name ?? row.name ?? '',
    description: row.product_description ?? row.description ?? '',
    category: row.product_category ?? row.category ?? '',
    price: Number(row.product_cost ?? row.price ?? 0),
    stock: row.stock ?? 99,
    image_url: productImageUrl(row.product_image || row.image_url || ''),
    product_image: row.product_image || '',
    raw: row,
  }
}

export function normalizeProducts(payload) {
  return unwrapList(payload, ['products']).map(normalizeProduct).filter(Boolean)
}

export function normalizeOrder(row) {
  if (!row) return null
  return {
    id: row.order_id ?? row.id,
    product_id: row.product_id,
    quantity: Number(row.quantity || 1),
    created_at: row.order_date,
    product_name: row.product_name,
    total_amount: Number(row.product_cost || 0) * Number(row.quantity || 1),
    status: row.status || 'Pending',
    product_image: productImageUrl(row.product_image || ''),
    raw: row,
  }
}

export function normalizePayment(row) {
  if (!row) return null
  return {
    id: row.payment_id ?? row.id,
    username: row.username,
    amount: Number(row.amount || 0),
    product_id: row.product_id,
    status: row.payment_status || row.status,
    created_at: row.payment_date,
    raw: row,
  }
}

export function normalizeTestimonial(row) {
  if (!row) return null
  const approved = row.approved === 1 || row.approved === true || row.approved === '1'
  return {
    id: row.testimonial_id ?? row.id,
    username: row.username,
    comment: row.review || row.comment || '',
    rating: Number(row.rating || 5),
    approved,
    status: approved ? 'approved' : 'pending',
    author: row.username,
    raw: row,
  }
}

// ——— Auth ———
export const authApi = {
  signup: (fields) => api.post('/signup', toFormData(fields)),
  login: (fields) => api.post('/login', toFormData(fields)),
}

// ——— Products ———
export const productsApi = {
  getAll: () => api.get('/get_products'),
  getById: (id) => api.get(`/get_product/${id}`),
  create: (fields) => api.post('/add_product', toFormData(fields)),
}

// ——— Orders ———
export const ordersApi = {
  getAll: () => api.get('/get_orders'),
  create: (fields) => api.post('/add_order', toFormData(fields)),
}

// ——— Payments ———
export const paymentsApi = {
  getAll: (params) => api.get('/get_payments', { params }),
  create: (fields) => api.post('/add_payment', toFormData(fields)),
  mpesa: (fields) => api.post('/mpesa_payment', toFormData(fields)),
}

// ——— Testimonials ———
export const testimonialsApi = {
  getAll: (params) => api.get('/get_testimonials', { params }),
  create: (fields) => api.post('/add_testimonial', toFormData(fields)),
}

export default api
