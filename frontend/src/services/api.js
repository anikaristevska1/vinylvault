import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export const recordsApi = {
  getAll: (params = {}) => api.get('/api/records', { params }).then(r => r.data),
  getById: (id) => api.get(`/api/records/${id}`).then(r => r.data),
  create: (data) => api.post('/api/records', data).then(r => r.data),
  update: (id, data) => api.put(`/api/records/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/api/records/${id}`),
  getGenres: () => api.get('/api/records/genres').then(r => r.data),
  getArtists: () => api.get('/api/records/artists').then(r => r.data),
  uploadCover: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/api/records/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}

/**
 * Vraka URL kon cover slika - prvo gleda za external URL (iTunes/CDN),
 * potoa za uploaded fajl, ili null ako nema slika.
 */
export const getCoverUrl = (record) => {
  if (!record) return null
  if (record.coverImageUrl) return record.coverImageUrl
  if (record.coverImagePath) return `${API_BASE}/api/images/${record.coverImagePath}`
  return null
}

export const formatPrice = (price) => {
  if (price == null) return '—'
  return `$${Number(price).toFixed(2)}`
}
