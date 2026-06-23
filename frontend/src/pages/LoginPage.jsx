import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">Welcome back to VinylVault.</p>

        {error && <div className="state state--error">{error}</div>}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="field__label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                   required className="input" autoComplete="email" />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   required className="input" autoComplete="current-password" />
          </label>

          <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register" className="text-link">Create an account</Link>
        </p>

        <div className="auth-hint mono">
          Demo: <code>admin@vinylvault.local / admin123</code><br />
          Demo: <code>user@vinylvault.local / user123</code>
        </div>
      </div>
    </div>
  )
}
