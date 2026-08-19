import { useEffect, useState } from 'react'
import { productsApi, normalizeProducts } from '../../lib/api'
import { PRODUCT_CATEGORIES, isValidCategory } from '../../lib/categories'
import { formatPrice } from '../../components/ProductCard'

const emptyForm = {
  product_name: '',
  product_cost: '',
  product_description: '',
  product_category: 'menshoes',
  product_image: null,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await productsApi.getAll()
      setProducts(normalizeProducts(data))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'product_image') {
      setForm((f) => ({ ...f, product_image: files?.[0] || null }))
      return
    }
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isValidCategory(form.product_category)) {
      setError('Invalid category. Choose from the allowed dropdown values.')
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await productsApi.create({
        product_name: form.product_name,
        product_description: form.product_description,
        product_category: form.product_category,
        product_cost: String(form.product_cost),
        product_image: form.product_image,
      })
      setForm(emptyForm)
      e.target.reset?.()
      setMessage('Product added successfully.')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not add product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-[var(--ck-accent)]">Product Management</h1>
      <p className="mt-2 text-sm text-[#9a9a9a]">
        Uses <code>POST /api/add_product</code> (multipart). Categories locked to the six approved values.
      </p>

      <form onSubmit={onSubmit} className="admin-panel mt-6 grid gap-4 p-5 md:grid-cols-2" encType="multipart/form-data">
        <div>
          <label className="ck-label text-[#aaa]">Product name</label>
          <input
            name="product_name"
            className="ck-input"
            required
            placeholder="e.g. Champion Dunk Low"
            value={form.product_name}
            onChange={onChange}
          />
          <p className="ck-hint">Short shop name customers will see on the card.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Cost (KES)</label>
          <input
            name="product_cost"
            type="number"
            min="0"
            step="1"
            className="ck-input"
            required
            placeholder="e.g. 4500"
            value={form.product_cost}
            onChange={onChange}
          />
          <p className="ck-hint">Price in Kenyan shillings, numbers only.</p>
        </div>
        <div className="md:col-span-2">
          <label className="ck-label text-[#aaa]">Description</label>
          <textarea
            name="product_description"
            className="ck-textarea"
            rows={3}
            placeholder="Fit, material, or what makes this drop special…"
            value={form.product_description}
            onChange={onChange}
          />
          <p className="ck-hint">One or two sentences is enough for the product card.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Category</label>
          <select
            name="product_category"
            className="ck-select"
            required
            value={form.product_category}
            onChange={onChange}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} ({c.value})
              </option>
            ))}
          </select>
          <p className="ck-hint">Pick the matching shoes or clothing category.</p>
        </div>
        <div>
          <label className="ck-label text-[#aaa]">Product image</label>
          <input
            name="product_image"
            type="file"
            accept="image/*"
            className="ck-input"
            onChange={onChange}
          />
          <p className="ck-hint">JPG or PNG, product photo on a clean background.</p>
        </div>
        {error && <p className="md:col-span-2 text-sm text-[var(--ck-danger)]">{error}</p>}
        {message && <p className="md:col-span-2 text-sm text-[var(--ck-success)]">{message}</p>}
        <div className="md:col-span-2">
          <button type="submit" className="ck-btn ck-btn-accent" disabled={saving}>
            {saving ? 'Saving…' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-[#9a9a9a]">Loading…</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-[#9a9a9a]">
              <tr>
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 pr-3">{p.id}</td>
                  <td className="py-3 pr-3">{p.name}</td>
                  <td className="py-3 pr-3">{p.category || '—'}</td>
                  <td className="py-3 pr-3">{formatPrice(p.price)}</td>
                  <td className="py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-10 w-10 object-cover" />
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && products.length === 0 && (
          <p className="mt-4 text-sm text-[#9a9a9a]">No products in the database yet.</p>
        )}
      </div>
    </div>
  )
}
