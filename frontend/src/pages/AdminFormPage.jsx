import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { recordsApi } from '../services/api.js'

const conditions = [
  { value: 'MINT', label: 'Mint' },
  { value: 'NEAR_MINT', label: 'Near Mint' },
  { value: 'VERY_GOOD', label: 'Very Good' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
]

const sizes = [
  { value: 'TWELVE_INCH', label: '12"' },
  { value: 'TEN_INCH', label: '10"' },
  { value: 'SEVEN_INCH', label: '7"' },
]

const emptyForm = {
  albumTitle: '',
  artist: '',
  genre: '',
  releaseYear: '',
  condition: 'VERY_GOOD',
  size: 'TWELVE_INCH',
  price: '',
  stockQuantity: 1,
  acquiredDate: '',
  notes: '',
  coverImageUrl: '',
}

export default function AdminFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [coverFile, setCoverFile] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    recordsApi.getById(id).then(data => {
      setForm({
        albumTitle: data.albumTitle || '',
        artist: data.artist || '',
        genre: data.genre || '',
        releaseYear: data.releaseYear || '',
        condition: data.condition || 'VERY_GOOD',
        size: data.size || 'TWELVE_INCH',
        price: data.price ?? '',
        stockQuantity: data.stockQuantity ?? 1,
        acquiredDate: data.acquiredDate || '',
        notes: data.notes || '',
        coverImageUrl: data.coverImageUrl || '',
      })
    }).catch(() => setError('Failed to load record'))
  }, [id, isEdit])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        releaseYear: form.releaseYear ? parseInt(form.releaseYear, 10) : null,
        price: form.price ? Number(form.price) : 0,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity, 10) : 0,
        acquiredDate: form.acquiredDate || null,
        coverImageUrl: form.coverImageUrl || null,
      }

      const saved = isEdit
        ? await recordsApi.update(id, payload)
        : await recordsApi.create(payload)

      if (coverFile) {
        await recordsApi.uploadCover(saved.id, coverFile)
      }

      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-form">
      <div className="admin-form__breadcrumb mono">
        <Link to="/admin">Admin</Link>
        <span>/</span>
        <span>{isEdit ? 'Edit record' : 'New record'}</span>
      </div>

      <h1 className="page-title">{isEdit ? 'Edit record' : 'New record'}</h1>

      {error && <div className="state state--error">{error}</div>}

      <form onSubmit={onSubmit} className="form">
        <div className="form__row">
          <label className="field">
            <span className="field__label">Album title</span>
            <input name="albumTitle" value={form.albumTitle} onChange={onChange}
                   required className="input" />
          </label>
          <label className="field">
            <span className="field__label">Artist</span>
            <input name="artist" value={form.artist} onChange={onChange}
                   required className="input" />
          </label>
        </div>

        <div className="form__row">
          <label className="field">
            <span className="field__label">Genre</span>
            <input name="genre" value={form.genre} onChange={onChange}
                   required className="input" placeholder="Rock, Jazz, Hip-Hop…" />
          </label>
          <label className="field">
            <span className="field__label">Release year</span>
            <input name="releaseYear" type="number" min="1900" max="2100"
                   value={form.releaseYear} onChange={onChange} className="input" />
          </label>
        </div>

        <div className="form__row">
          <label className="field">
            <span className="field__label">Condition</span>
            <select name="condition" value={form.condition} onChange={onChange}
                    className="select">
              {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Size</span>
            <select name="size" value={form.size} onChange={onChange} className="select">
              {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <div className="form__row">
          <label className="field">
            <span className="field__label">Price ($)</span>
            <input name="price" type="number" step="0.01" min="0"
                   value={form.price} onChange={onChange} required className="input" />
          </label>
          <label className="field">
            <span className="field__label">Stock quantity</span>
            <input name="stockQuantity" type="number" min="0"
                   value={form.stockQuantity} onChange={onChange} required className="input" />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Notes</span>
          <textarea name="notes" value={form.notes} onChange={onChange}
                    rows="4" className="textarea"
                    placeholder="Pressing details, provenance, condition notes…" />
        </label>

        <label className="field">
          <span className="field__label">Cover image URL (optional)</span>
          <input name="coverImageUrl" type="url" value={form.coverImageUrl}
                 onChange={onChange} className="input"
                 placeholder="https://… (or upload a file below)" />
        </label>

        <label className="field">
          <span className="field__label">Or upload cover file</span>
          <input type="file" accept="image/*"
                 onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                 className="input" />
          {coverFile && <span className="field__hint mono">Selected: {coverFile.name}</span>}
        </label>

        <div className="form__actions">
          <button type="button" onClick={() => navigate('/admin')}
                  className="btn btn--ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn--primary">
            {saving ? 'Saving…' : (isEdit ? 'Update record' : 'Create record')}
          </button>
        </div>
      </form>
    </div>
  )
}
