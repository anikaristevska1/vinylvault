import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getCoverUrl, formatPrice } from '../services/api.js'

export default function CartPage() {
  const { items, subtotal, itemCount, updateQty, remove, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart">
        <h1 className="page-title">Cart</h1>
        <div className="state state--empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn--primary">Browse catalog</Link>
        </div>
      </div>
    )
  }

  const shipping = 0  // free for now
  const total = subtotal + shipping

  return (
    <div className="cart">
      <div className="page-header">
        <h1 className="page-title">Cart</h1>
        <p className="page-subtitle mono">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="cart__layout">
        <ul className="cart__list">
          {items.map(item => {
            const cover = getCoverUrl(item)
            return (
              <li key={item.id} className="cart-item">
                <Link to={`/records/${item.id}`} className="cart-item__cover">
                  {cover ? <img src={cover} alt={item.albumTitle} /> :
                    <div className="cart-item__placeholder">◐</div>}
                </Link>
                <div className="cart-item__info">
                  <Link to={`/records/${item.id}`} className="cart-item__title">
                    {item.albumTitle}
                  </Link>
                  <p className="cart-item__artist">{item.artist}</p>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="qty-btn">−</button>
                    <span className="mono">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="qty-btn">+</button>
                  </div>
                </div>
                <div className="cart-item__price">
                  <span className="mono">{formatPrice(Number(item.price) * item.quantity)}</span>
                  <button onClick={() => remove(item.id)} className="text-link">
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="cart-summary">
          <h2 className="cart-summary__title">Summary</h2>
          <dl className="cart-summary__lines">
            <dt>Subtotal</dt>
            <dd className="mono">{formatPrice(subtotal)}</dd>
            <dt>Shipping</dt>
            <dd className="mono">Free</dd>
          </dl>
          <div className="cart-summary__total">
            <span>Total</span>
            <span className="mono">{formatPrice(total)}</span>
          </div>
          <button
            onClick={() => alert('Checkout flow not implemented in this demo.')}
            className="btn btn--primary btn--block btn--lg"
          >
            Checkout
          </button>
          <button onClick={clear} className="btn btn--ghost btn--block">
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  )
}
