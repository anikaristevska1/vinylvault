import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const TOKEN_KEY = 'vinylvault_token'
const USER_KEY = 'vinylvault_user'
const API_BASE = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  // Set Authorization header on axios default whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const persist = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
      localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    setToken(newToken)
    setUser(newUser)
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password })
      persist(data.token, data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, payload)
      persist(data.token, data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    persist(null, null)
  }

  const refreshProfile = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/users/me`)
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      setUser(data)
      return data
    } catch (err) {
      // Token invalid - log out
      if (err.response?.status === 401) logout()
      throw err
    }
  }

  const updateProfile = async (payload) => {
    const { data } = await axios.put(`${API_BASE}/api/users/me`, payload)
    localStorage.setItem(USER_KEY, JSON.stringify(data))
    setUser(data)
    return data
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
