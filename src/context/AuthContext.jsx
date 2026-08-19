import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

function readUser() {
  try {
    const raw = localStorage.getItem('ck_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const persist = useCallback((nextUser) => {
    if (nextUser) localStorage.setItem('ck_user', JSON.stringify(nextUser))
    else localStorage.removeItem('ck_user')
    localStorage.removeItem('ck_token')
    setUser(nextUser)
  }, [])

  const signin = useCallback(
    async (email, password) => {
      const { data } = await authApi.login({ email, password })
      const nextUser = data.user
      if (!nextUser) throw new Error(data.message || 'Login failed')
      persist(nextUser)
      return nextUser
    },
    [persist],
  )

  const signup = useCallback(
    async (payload) => {
      await authApi.signup({
        username: payload.username,
        email: payload.email,
        phone: payload.phone || '',
        password: payload.password,
        address: payload.address || '',
      })
      // Auto-login after signup (backend signup does not return a session token)
      const nextUser = await signin(payload.email, payload.password)
      return { user: nextUser }
    },
    [signin],
  )

  const signout = useCallback(() => {
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.user_id || user?.email),
      isAdmin: false,
      signin,
      signup,
      signout,
    }),
    [user, signin, signup, signout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
