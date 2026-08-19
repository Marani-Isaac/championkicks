import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const requested = location.state?.from || '/'
  const from = String(requested).startsWith('/admin') ? '/' : requested

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signin(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ck-container flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={onSubmit} className="ck-card-surface w-full max-w-md space-y-4 p-6">
        <h1 className="font-display text-4xl">Sign In</h1>
        <p className="text-sm text-[var(--ck-mute)]">Access your Champion Kicks account.</p>
        <div>
          <label className="ck-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="ck-input"
            required
            placeholder="e.g. jane@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="ck-hint">Enter the email you used when creating your account.</p>
        </div>
        <div>
          <label className="ck-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="ck-input"
            required
            placeholder="Your account password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="ck-hint">Passwords are case-sensitive.</p>
        </div>
        {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}
        <button type="submit" className="ck-btn ck-btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-[var(--ck-mute)]">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-[var(--ck-ink)] underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
