import { useState } from 'react'
import { testimonialsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  BRANCHES,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  mapsEmbedUrl,
} from '../lib/company'
import SocialLinks from '../components/SocialLinks'

const careCards = [
  {
    title: 'Call',
    hint: 'Speak with the team during shop hours.',
    content: (
      <a className="font-semibold text-[var(--ck-ink)] underline" href={PHONE_TEL}>
        {PHONE_DISPLAY}
      </a>
    ),
  },
  {
    title: 'WhatsApp',
    hint: 'Fastest way for size checks and stock.',
    content: (
      <a
        className="font-semibold text-[var(--ck-ink)] underline"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
      >
        {PHONE_DISPLAY}
      </a>
    ),
  },
  {
    title: 'Email',
    hint: 'For invoices, orders, and written follow-up.',
    content: (
      <a className="break-all font-semibold text-[var(--ck-ink)] underline" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
    ),
  },
  {
    title: 'Hours',
    hint: 'Both Nairobi and Eldoret branches.',
    content: <p className="font-semibold text-[var(--ck-ink)]">Daily, 10:00–17:00</p>,
  },
]

export default function Contact() {
  const { isAuthenticated, user } = useAuth()
  const [form, setForm] = useState({
    username: user?.username || '',
    review: '',
    rating: '5',
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    setError('')
    if (!isAuthenticated) {
      setError('Please sign in to submit a testimonial.')
      return
    }
    try {
      await testimonialsApi.create({
        username: form.username || user?.username,
        review: form.review,
        rating: String(form.rating),
        approved: '0',
      })
      setStatus('Thanks — your review was submitted and awaits admin approval.')
      setForm((f) => ({ ...f, review: '', rating: '5' }))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not send message')
    }
  }

  return (
    <div className="ck-container py-12">
      <h1 className="font-display text-5xl">Contact Us</h1>
      <p className="mt-2 max-w-xl text-sm font-normal text-[var(--ck-mute)]">
        Visit a branch, call or WhatsApp {PHONE_DISPLAY}, or leave a review for the team.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {BRANCHES.map((branch) => (
          <article key={branch.city} className="ck-premium-card overflow-hidden">
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ck-mute)]">
                {branch.city} branch
              </p>
              <h2 className="mt-1 font-display text-3xl">{branch.name}</h2>
              {branch.detail && <p className="mt-1 text-sm text-[var(--ck-mute)]">{branch.detail}</p>}
            </div>
            <iframe
              title={`${branch.city} map`}
              src={mapsEmbedUrl(branch.mapQuery)}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="ck-card-surface space-y-4 p-5">
          <h2 className="font-display text-3xl">Leave a review</h2>
          <div>
            <label className="ck-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              className="ck-input"
              required
              placeholder="e.g. jane_kicks"
              value={form.username}
              onChange={onChange}
            />
            <p className="ck-hint">Use the name on your Champion Kicks account.</p>
          </div>
          <div>
            <label className="ck-label" htmlFor="rating">
              Rating
            </label>
            <select id="rating" name="rating" className="ck-select" value={form.rating} onChange={onChange}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <p className="ck-hint">5 is excellent. 1 means we need to do better.</p>
          </div>
          <div>
            <label className="ck-label" htmlFor="review">
              Review / message
            </label>
            <textarea
              id="review"
              name="review"
              className="ck-textarea"
              rows={5}
              required
              placeholder="Tell us about fit, quality, service, or a recent visit…"
              value={form.review}
              onChange={onChange}
            />
            <p className="ck-hint">A few sentences help other shoppers decide.</p>
          </div>
          {!isAuthenticated && (
            <p className="text-sm text-[var(--ck-mute)]">
              <Link to="/signin" className="font-semibold underline">
                Sign in
              </Link>{' '}
              to submit a testimonial.
            </p>
          )}
          {status && <p className="text-sm text-[var(--ck-success)]">{status}</p>}
          {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}
          <button type="submit" className="ck-btn ck-btn-primary">
            Submit review
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="font-display text-3xl">Customer care</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {careCards.map((card) => (
              <article key={card.title} className="ck-card-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ck-mute)]">
                  {card.title}
                </p>
                <div className="mt-2 text-sm">{card.content}</div>
                <p className="ck-hint">{card.hint}</p>
              </article>
            ))}
          </div>
          <div className="ck-card-surface p-4">
            <p className="ck-label">Social</p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  )
}
