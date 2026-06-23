/**
 * Pagination со паметно скратување за многу страници.
 * Прикажува: ‹ 1 2 3 ... 7 ›  или  ‹ 1 ... 4 5 6 ... 10 ›
 */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  // На почеток
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total]
  }
  // На крај
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }
  // Среден дел
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function Pagination({ currentPage, totalPages, onChange }) {
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination__btn pagination__btn--nav"
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      <div className="pagination__pages">
        {pages.map((page, i) => (
          page === '...' ? (
            <span key={`dots-${i}`} className="pagination__ellipsis mono">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`pagination__btn ${page === currentPage ? 'is-active' : ''}`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination__btn pagination__btn--nav"
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  )
}
