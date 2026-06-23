import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState(null)

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start your vinyl collection.</p>

        {error && <div className="state state--error">{error}</div>}

        <form onSubmit={onSubmit} className="form">
          <div className="form__row">
            <label className="field">
              <span className="field__label">First name</span>
              <input name="firstName" value={form.firstName} onChange={onChange}
                     required className="input" autoComplete="given-name" />
            </label>
            <label className="field">
              <span className="field__label">Last name</span>
              <input name="lastName" value={form.lastName} onChange={onChange}
                     required className="input" autoComplete="family-name" />
            </label>
          </div>

          <label className="field">
            <span className="field__label">Email</span>
            <input type="email" name="email" value={form.email} onChange={onChange}
                   required className="input" autoComplete="email" />
          </label>

          <label className="field">
            <span className="field__label">Password (min 6 chars)</span>
            <input type="password" name="password" value={form.password} onChange={onChange}
                   required minLength={6} className="input" autoComplete="new-password" />
          </label>

          <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="text-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
