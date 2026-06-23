import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { recordsApi, getCoverUrl, formatPrice } from '../services/api.js'

export default function AdminListPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    recordsApi.getAll().then(setRecords).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onDelete = async (record) => {
    if (!confirm(`Delete "${record.albumTitle}" by ${record.artist}?`)) return
    await recordsApi.delete(record.id)
    load()
  }

  return (
    <div className="admin">
      <div className="page-header page-header--with-action">
        <div>
          <h1 className="page-title">Admin · Inventory</h1>
          <p className="page-subtitle mono">{records.length} records</p>
        </div>
        <Link to="/admin/new" className="btn btn--primary">+ New record</Link>
      </div>

      {loading ? (
        <div className="state">Loading…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Album</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const cover = getCoverUrl(r)
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="admin-thumb">
                        {cover ? <img src={cover} alt="" /> : '◐'}
                      </div>
                    </td>
                    <td>
                      <Link to={`/records/${r.id}`} className="text-link">
                        {r.albumTitle}
                      </Link>
                    </td>
                    <td>{r.artist}</td>
                    <td className="mono">{r.genre}</td>
                    <td className="mono">{r.releaseYear || '—'}</td>
                    <td className="mono">{formatPrice(r.price)}</td>
                    <td className="mono">{r.stockQuantity}</td>
                    <td className="admin-table__actions">
                      <Link to={`/admin/records/${r.id}/edit`} className="text-link">
                        Edit
                      </Link>
                      <button onClick={() => onDelete(r)} className="text-link text-link--danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
