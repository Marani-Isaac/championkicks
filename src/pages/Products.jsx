import { useEffect, useMemo, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productsApi, normalizeProducts } from '../lib/api'
import { PRODUCT_CATEGORIES } from '../lib/categories'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const section = searchParams.get('section') || 'all'
  const gender = searchParams.get('gender') || 'all'

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const { data } = await productsApi.getAll()
        if (!active) return
        setProducts(normalizeProducts(data))
        setError('')
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        [p.name, p.description, p.category]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))

      if (!matchesQuery) return false

      if (section === 'shoes') {
        if (!String(p.category || '').includes('shoes')) return false
        if (gender !== 'all') {
          const map = { men: 'menshoes', women: 'wemenshoes', kids: 'kidsshoes' }
          return p.category === map[gender]
        }
        return true
      }

      if (section === 'clothing') {
        if (!String(p.category || '').includes('clothings')) return false
        if (gender !== 'all') {
          const map = { men: 'menclothings', women: 'wemenclothings', kids: 'kidsclothings' }
          return p.category === map[gender]
        }
        return true
      }

      return true
    })
  }, [products, query, section, gender])

  const setSection = (next) => {
    const params = new URLSearchParams(searchParams)
    params.set('section', next)
    if (next === 'all') params.delete('gender')
    else if (!params.get('gender')) params.set('gender', 'all')
    setSearchParams(params)
  }

  const setGender = (next) => {
    const params = new URLSearchParams(searchParams)
    params.set('gender', next)
    setSearchParams(params)
  }

  const onSearchChange = (value) => {
    setQuery(value)
    const params = new URLSearchParams(searchParams)
    if (value.trim()) params.set('q', value.trim())
    else params.delete('q')
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="ck-container py-10">
      <div className="mb-8">
        <h1 className="font-display text-5xl">Our Products</h1>
        <p className="mt-2 text-sm text-[var(--ck-mute)]">
          Search and filter across shoes and clothing — {PRODUCT_CATEGORIES.length} curated categories.
        </p>
      </div>

      <div className="mb-6">
        <label className="ck-label" htmlFor="product-search">
          Global search
        </label>
        <input
          id="product-search"
          type="search"
          className="ck-input max-w-xl"
          placeholder="e.g. Air Force, hoodie, sneakers…"
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <p className="ck-hint">Type a product name, category, or keyword to filter the list.</p>
      </div>

      <Tabs activeKey={section} onSelect={(k) => setSection(k || 'all')} className="mb-4" justify>
        <Tab eventKey="all" title="All Products" />
        <Tab eventKey="shoes" title="Shoes" />
        <Tab eventKey="clothing" title="Clothing" />
      </Tabs>

      {(section === 'shoes' || section === 'clothing') && (
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'men', 'women', 'kids'].map((g) => (
            <button
              key={g}
              type="button"
              className={`ck-btn px-3 py-2 text-xs ${gender === g ? 'ck-btn-primary' : 'ck-btn-outline'}`}
              onClick={() => setGender(g)}
            >
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm text-[var(--ck-mute)]">Loading inventory…</p>}
      {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}

      {!loading && !error && (
        <p className="mb-4 text-sm text-[var(--ck-mute)]">
          Showing {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="ck-card-surface ck-card-accent mt-4 p-8 text-center text-sm text-[var(--ck-mute)]">
          No products match this filter. Try another category or clear search.
        </div>
      )}
    </div>
  )
}
