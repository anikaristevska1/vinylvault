import { useState } from 'react'

export default function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="filter-section">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="filter-section__head"
      >
        <span>{title}</span>
        <span className={`filter-section__chevron ${open ? 'is-open' : ''}`}>+</span>
      </button>
      {open && <div className="filter-section__body">{children}</div>}
    </div>
  )
}
