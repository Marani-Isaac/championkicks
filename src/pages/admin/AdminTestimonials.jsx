import { useEffect, useState } from 'react'
import { testimonialsApi, unwrapList, normalizeTestimonial } from '../../lib/api'
import Badge from '../../components/Badge'

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      // approved=false returns all testimonials including pending
      const { data } = await testimonialsApi.getAll({ approved: 'false' })
      setItems(unwrapList(data, ['testimonials']).map(normalizeTestimonial).filter(Boolean))
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (item) => {
    setMessage('')
    setError('')
    try {
      // Backend has no update route — re-insert as approved copy for moderation workflow
      await testimonialsApi.update({
        testimonial_id: String(item.id),
        approved: '1',
      })
      setMessage(`Published testimonial #${item.id}.`)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Approve failed')
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-[var(--ck-accent)]">
        Testimonial Moderation
      </h1>
      <p className="mt-2 text-sm text-[#9a9a9a]">
        Lists all reviews via <code>GET /api/get_testimonials?approved=false</code>. Approving updates the
        existing row to <code>approved=1</code>.
      </p>

      {message && <p className="mt-4 text-sm text-[var(--ck-success)]">{message}</p>}
      {error && <p className="mt-4 text-sm text-[var(--ck-danger)]">{error}</p>}
      {loading && <p className="mt-6 text-sm text-[#9a9a9a]">Loading…</p>}

      <div className="mt-6 space-y-3">
        {items.map((t) => (
          <article key={t.id} className="admin-panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  #{t.id} · {t.rating}/5
                </p>
                <p className="mt-2 text-sm text-[#d0d0d0]">&ldquo;{t.comment}&rdquo;</p>
                <p className="mt-2 text-xs text-[#9a9a9a]">{t.username || 'Anonymous'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={t.approved ? 'success' : 'muted'}>
                  {t.approved ? 'Published' : 'Pending'}
                </Badge>
                {!t.approved && (
                  <button
                    type="button"
                    className="ck-btn ck-btn-accent px-3 py-2 text-xs"
                    onClick={() => approve(t)}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-6 text-sm text-[#9a9a9a]">No testimonials found.</p>
      )}
    </div>
  )
}
