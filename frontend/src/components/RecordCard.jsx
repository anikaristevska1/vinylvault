import { Link } from 'react-router-dom'
import { getCoverUrl, formatPrice } from '../services/api.js'

export default function RecordCard({ record }) {
  const cover = getCoverUrl(record)
  const outOfStock = (record.stockQuantity ?? 0) <= 0

  return (
    <Link to={`/records/${record.id}`} className="record-card">
      <div className="record-card__cover">
        {cover ? (
          <img src={cover} alt={`${record.albumTitle} cover`} loading="lazy" />
        ) : (
          <div className="record-card__placeholder">
            <span>◐</span>
          </div>
        )}
        {outOfStock && (
          <span className="record-card__badge mono">SOLD OUT</span>
        )}
      </div>
      <div className="record-card__meta">
        <div className="record-card__title-row">
          <h3 className="record-card__title">{record.albumTitle}</h3>
          <span className="record-card__price mono">{formatPrice(record.price)}</span>
        </div>
        <p className="record-card__artist">{record.artist}</p>
      </div>
    </Link>
  )
}
