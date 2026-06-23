import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { recordsApi, getCoverUrl, formatPrice } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const conditionLabel = {
  MINT: 'Mint', NEAR_MINT: 'Near Mint', VERY_GOOD: 'Very Good',
  GOOD: 'Good', FAIR: 'Fair', POOR: 'Poor',
}

const sizeLabel = {
  TWELVE_INCH: '12"', TEN_INCH: '10"', SEVEN_INCH: '7"',
}

export default function RecordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { add } = useCart()
  const { isAuthenticated, isAdmin } = useAuth()

  const [record, setRecord] = useState(null)
  const [error, setError] = useState(null)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    recordsApi.getById(id)
      .then(setRecord)
      .catch(() => setError('Record not found'))
  }, [id])

  if (error) return <div className="state state--error">{error}</div>
  if (!record) return <div className="state">Loading…</div>

  const cover = getCoverUrl(record)
  const outOfStock = (record.stockQuantity ?? 0) <= 0

  const onAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    add(record)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="detail">
      <div className="detail__breadcrumb mono">
        <Link to="/">Catalog</Link>
        <span>/</span>
        <span>{record.albumTitle}</span>
      </div>

      <div className="detail__grid">
        <div className="detail__cover">
          {cover ? (
            <img src={cover} alt={record.albumTitle} />
          ) : (
            <div className="detail__placeholder">◐</div>
          )}
        </div>

        <div className="detail__info">
          <p className="detail__artist">{record.artist}</p>
          <h1 className="detail__title">{record.albumTitle}</h1>

          <div className="detail__price-row">
            <span className="detail__price mono">{formatPrice(record.price)}</span>
            <span className={`detail__stock mono ${outOfStock ? 'is-out' : ''}`}>
              {outOfStock ? '· SOLD OUT' : `· ${record.stockQuantity} in stock`}
            </span>
          </div>

          <dl className="detail__specs">
            <dt>Genre</dt><dd>{record.genre}</dd>
            {record.releaseYear && (<><dt>Year</dt><dd>{record.releaseYear}</dd></>)}
            {record.size && (<><dt>Size</dt><dd>{sizeLabel[record.size]}</dd></>)}
            <dt>Condition</dt>
            <dd>{conditionLabel[record.condition] || record.condition}</dd>
          </dl>

          {record.notes && (
            <div className="detail__notes">
              <h3>Notes</h3>
              <p>{record.notes}</p>
            </div>
          )}

          <div className="detail__actions">
            <button
              onClick={onAddToCart}
              disabled={outOfStock}
              className="btn btn--primary btn--lg"
            >
              {outOfStock ? 'Sold out'
                : !isAuthenticated ? 'Sign in to buy'
                : justAdded ? 'Added ✓'
                : 'Add to Cart'}
            </button>
            {isAdmin && (
              <Link to={`/admin/records/${id}/edit`} className="btn btn--ghost">
                Edit (admin)
              </Link>
            )}
            <button onClick={() => navigate(-1)} className="btn btn--ghost">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
