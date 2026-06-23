import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../services/api.js'

export default function ProfilePage() {
  const { user, logout, updateProfile, refreshProfile } = useAuth()
  const { itemCount, subtotal } = useCart()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    refreshProfile().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        addressLine: user.addressLine || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      })
    }
  }, [user])

  if (!user || !form) return <div className="state">Loading…</div>

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await updateProfile(form)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const onLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__avatar">{initials || '?'}</div>
        <div className="profile__heading">
          <h1 className="profile__name">{user.firstName} {user.lastName}</h1>
          <p className="profile__email">{user.email}</p>
          <div className="profile__badges">
            <span className={`badge-role ${user.role === 'ADMIN' ? 'badge-role--admin' : ''}`}>
              {user.role}
            </span>
            <span className="profile__since mono">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {success && <div className="state state--success">Profile updated ✓</div>}
      {error && <div className="state state--error">{error}</div>}

      <div className="profile__grid">
        <section className="profile-card">
          <div className="profile-card__head">
            <h2 className="profile-card__title">Profile details</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn btn--ghost">Edit</button>
            )}
          </div>

          {editing ? (
            <form onSubmit={onSave} className="form">
              <div className="form__row">
                <label className="field">
                  <span className="field__label">First name</span>
                  <input name="firstName" value={form.firstName} onChange={onChange}
                         required className="input" />
                </label>
                <label className="field">
                  <span className="field__label">Last name</span>
                  <input name="lastName" value={form.lastName} onChange={onChange}
                         required className="input" />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Address</span>
                <input name="addressLine" value={form.addressLine} onChange={onChange}
                       className="input" placeholder="Street and number" />
              </label>
              <div className="form__row">
                <label className="field">
                  <span className="field__label">City</span>
                  <input name="city" value={form.city} onChange={onChange} className="input" />
                </label>
                <label className="field">
                  <span className="field__label">Postal code</span>
                  <input name="postalCode" value={form.postalCode} onChange={onChange} className="input" />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Country</span>
                <input name="country" value={form.country} onChange={onChange} className="input" />
              </label>
              <div className="form__actions">
                <button type="button" onClick={() => setEditing(false)} className="btn btn--ghost">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn--primary">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="profile-details">
              <dt>Name</dt><dd>{user.firstName} {user.lastName}</dd>
              <dt>Email</dt><dd>{user.email}</dd>
              <dt>Address</dt><dd>{user.addressLine || <span className="muted">Not set</span>}</dd>
              <dt>City</dt><dd>{user.city || <span className="muted">—</span>}</dd>
              <dt>Postal</dt><dd>{user.postalCode || <span className="muted">—</span>}</dd>
              <dt>Country</dt><dd>{user.country || <span className="muted">—</span>}</dd>
            </dl>
          )}
        </section>

        <aside className="profile-side">
          <div className="profile-card">
            <h2 className="profile-card__title">Cart summary</h2>
            <dl className="profile-stats">
              <dt>Items</dt>
              <dd className="mono">{itemCount}</dd>
              <dt>Subtotal</dt>
              <dd className="mono">{formatPrice(subtotal)}</dd>
            </dl>
          </div>

          <button onClick={onLogout} className="btn btn--ghost btn--block">
            Sign out
          </button>
        </aside>
      </div>
    </div>
  )
}
