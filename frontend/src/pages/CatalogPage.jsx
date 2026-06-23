import { useEffect, useMemo, useState } from 'react'
import { recordsApi } from '../services/api.js'
import RecordCard from '../components/RecordCard.jsx'
import FilterSection from '../components/FilterSection.jsx'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 15  // 3 cols × 5 rows

const SIZE_OPTIONS = [
  { value: 'TWELVE_INCH', label: '12"' },
  { value: 'TEN_INCH', label: '10"' },
  { value: 'SEVEN_INCH', label: '7"' },
]

const yearToEra = (year) => {
  if (!year) return null
  if (year >= 2020) return "2020s"
  if (year >= 2010) return "2010s"
  if (year >= 2000) return "2000s"
  if (year >= 1990) return "90s"
  if (year >= 1980) return "80s"
  if (year >= 1970) return "70s"
  if (year >= 1960) return "60s"
  return "Vintage"
}

const ERA_OPTIONS = ["2020s", "2010s", "2000s", "90s", "80s", "70s", "60s", "Vintage"]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'year_desc', label: 'Newest First' },
  { value: 'year_asc', label: 'Oldest First' },
  { value: 'title', label: 'Title A–Z' },
]

export default function CatalogPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [sizes, setSizes] = useState([])
  const [genres, setGenres] = useState([])
  const [eras, setEras] = useState([])
  const [artists, setArtists] = useState([])
  const [artistSearch, setArtistSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    recordsApi.getAll()
      .then(setRecords)
      .catch(() => setError('Failed to load catalog. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  // Reset to page 1 whenever any filter or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, sizes, genres, eras, artists, sortBy])

  const allGenres = useMemo(
    () => [...new Set(records.map(r => r.genre).filter(Boolean))].sort(),
    [records]
  )

  const allArtists = useMemo(
    () => [...new Set(records.map(r => r.artist).filter(Boolean))].sort(),
    [records]
  )

  const filteredArtists = useMemo(() => {
    if (!artistSearch) return allArtists
    return allArtists.filter(a =>
      a.toLowerCase().includes(artistSearch.toLowerCase())
    )
  }, [allArtists, artistSearch])

  const filtered = useMemo(() => {
    let result = records

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(r =>
        r.albumTitle.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q)
      )
    }
    if (sizes.length) result = result.filter(r => sizes.includes(r.size))
    if (genres.length) result = result.filter(r => genres.includes(r.genre))
    if (eras.length) result = result.filter(r => eras.includes(yearToEra(r.releaseYear)))
    if (artists.length) result = result.filter(r => artists.includes(r.artist))

    const sorted = [...result]
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price)); break
      case 'price_desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price)); break
      case 'year_desc':
        sorted.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0)); break
      case 'year_asc':
        sorted.sort((a, b) => (a.releaseYear || 9999) - (b.releaseYear || 9999)); break
      case 'title':
        sorted.sort((a, b) => a.albumTitle.localeCompare(b.albumTitle)); break
    }
    return sorted
  }, [records, search, sizes, genres, eras, artists, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const onPageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of grid smoothly
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const toggleIn = (setter) => (value) =>
    setter(prev => prev.includes(value)
      ? prev.filter(v => v !== value)
      : [...prev, value])

  const clearAll = () => {
    setSearch('')
    setSizes([])
    setGenres([])
    setEras([])
    setArtists([])
    setArtistSearch('')
  }

  const activeFilterCount =
    sizes.length + genres.length + eras.length + artists.length + (search ? 1 : 0)

  // Helper to count records matching a single filter option (for badges in sidebar)
  const countFor = (predicate) => records.filter(predicate).length

  return (
    <>
      <section className="hero">
        <div className="hero__eyebrow mono">
          <span>◯ Curated wax · Pressed for keeps</span>
        </div>
        <h1 className="hero__title">
          VINYL<br />RECORDS.
        </h1>
        <p className="hero__lede">
          {records.length} records in stock. Original pressings, reissues, and rarities — handpicked, graded, and ready to spin.
        </p>
      </section>

      <div className="catalog-bar">
        <div className="catalog-bar__results mono">
          {loading ? 'Loading…' : `${filtered.length} of ${records.length}`}
        </div>
        <input
          type="text"
          placeholder="Search album or artist…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input--search"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select--sort"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="catalog-layout">
        <aside className="filters">
          <div className="filters__header">
            <h2 className="filters__title">Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-link mono">
                Clear ({activeFilterCount})
              </button>
            )}
          </div>

          <FilterSection title="Size">
            {SIZE_OPTIONS.map(opt => {
              const count = countFor(r => r.size === opt.value)
              return (
                <label key={opt.value} className={`check ${count === 0 ? 'check--empty' : ''}`}>
                  <input type="checkbox" checked={sizes.includes(opt.value)}
                         onChange={() => toggleIn(setSizes)(opt.value)}
                         disabled={count === 0} />
                  <span>{opt.label}</span>
                  <span className="check__count mono">{count}</span>
                </label>
              )
            })}
          </FilterSection>

          <FilterSection title="Genre">
            {allGenres.length === 0 && <p className="filters__empty mono">—</p>}
            {allGenres.map(g => {
              const count = countFor(r => r.genre === g)
              return (
                <label key={g} className="check">
                  <input type="checkbox" checked={genres.includes(g)}
                         onChange={() => toggleIn(setGenres)(g)} />
                  <span>{g}</span>
                  <span className="check__count mono">{count}</span>
                </label>
              )
            })}
          </FilterSection>

          <FilterSection title="Era">
            {ERA_OPTIONS.map(era => {
              const count = countFor(r => yearToEra(r.releaseYear) === era)
              return (
                <label key={era} className={`check ${count === 0 ? 'check--empty' : ''}`}>
                  <input type="checkbox" checked={eras.includes(era)}
                         onChange={() => toggleIn(setEras)(era)}
                         disabled={count === 0} />
                  <span>{era}</span>
                  <span className="check__count mono">{count}</span>
                </label>
              )
            })}
          </FilterSection>

          <FilterSection title="Artist">
            <input
              type="text"
              placeholder="Search artist…"
              value={artistSearch}
              onChange={(e) => setArtistSearch(e.target.value)}
              className="input input--small"
            />
            <div className="filters__scroll">
              {filteredArtists.length === 0 && (
                <p className="filters__empty mono">No matches</p>
              )}
              {filteredArtists.map(a => {
                const count = countFor(r => r.artist === a)
                return (
                  <label key={a} className="check">
                    <input type="checkbox" checked={artists.includes(a)}
                           onChange={() => toggleIn(setArtists)(a)} />
                    <span>{a}</span>
                    <span className="check__count mono">{count}</span>
                  </label>
                )
              })}
            </div>
          </FilterSection>
        </aside>

        <section className="catalog-grid-wrap">
          {error && <div className="state state--error">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="state state--empty">
              <h3>No records match these filters.</h3>
              <button onClick={clearAll} className="btn btn--ghost">Clear filters</button>
            </div>
          )}
          <div className="catalog-grid">
            {paginated.map(r => <RecordCard key={r.id} record={r} />)}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={onPageChange}
            />
          )}
        </section>
      </div>
    </>
  )
}
