import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signup({
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ck-container flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={onSubmit} className="ck-card-surface w-full max-w-md space-y-4 p-6">
        <h1 className="font-display text-4xl">Sign Up</h1>
        <p className="text-sm text-[var(--ck-mute)]">Join Champion Kicks to checkout and leave reviews.</p>
        {[
          ['username', 'Username', 'text', 'e.g. jane_kicks', 'Letters, numbers, or underscores — this is how we greet you.'],
          ['email', 'Email', 'email', 'e.g. jane@email.com', 'We will send order updates here.'],
          ['phone', 'Phone', 'tel', 'e.g. 0727 091 597', 'Kenyan mobile number for delivery and M-Pesa.'],
          ['address', 'Address', 'text', 'Street, estate, city', 'Building, street, and area so we can find you.'],
          ['password', 'Password', 'password', 'At least 4 characters', 'Choose something you will remember.'],
          ['confirm', 'Confirm password', 'password', 'Re-enter your password', 'Must match the password above.'],
        ].map(([name, label, type, placeholder, hint]) => (
          <div key={name}>
            <label className="ck-label" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              className="ck-input"
              required={name !== 'phone' && name !== 'address'}
              minLength={name === 'password' || name === 'confirm' ? 4 : undefined}
              placeholder={placeholder}
              value={form[name]}
              onChange={onChange}
            />
            <p className="ck-hint">{hint}</p>
          </div>
        ))}
        {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}
        <button type="submit" className="ck-btn ck-btn-accent w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-[var(--ck-mute)]">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
