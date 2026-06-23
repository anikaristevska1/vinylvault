import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { useCart } from './context/CartContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import RecordDetailPage from './pages/RecordDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import AdminListPage from './pages/AdminListPage.jsx'
import AdminFormPage from './pages/AdminFormPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  const { itemCount } = useCart()
  const { isAuthenticated, isAdmin, user } = useAuth()

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark">◐</span>
            <span className="brand__name">VinylVault</span>
          </Link>

          <nav className="nav">
            <NavLink to="/" end className="nav__link">Catalog</NavLink>
            {isAdmin && <NavLink to="/admin" className="nav__link">Admin</NavLink>}
            <NavLink to="/cart" className="nav__link nav__link--cart">
              Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </NavLink>
            {isAuthenticated ? (
              <NavLink to="/profile" className="nav__link nav__link--user">
                <span className="user-chip">
                  <span className="user-chip__initials">
                    {(user?.firstName?.[0] || '').toUpperCase()}
                  </span>
                  <span>{user?.firstName}</span>
                </span>
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="nav__link">Sign in</NavLink>
                <NavLink to="/register" className="nav__link nav__link--cta">Register</NavLink>
              </>
            )}
          </nav>
        </div>
        <div className="site-header__rule" />
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/records/:id" element={<RecordDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><AdminListPage /></ProtectedRoute>
          } />
          <Route path="/admin/new" element={
            <ProtectedRoute requireAdmin><AdminFormPage /></ProtectedRoute>
          } />
          <Route path="/admin/records/:id/edit" element={
            <ProtectedRoute requireAdmin><AdminFormPage /></ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer__rule" />
        <div className="site-footer__inner">
          <span>VinylVault · KIII Project</span>
          <span className="mono">FINKI / UKIM · 2026</span>
        </div>
      </footer>
    </div>
  )
}

export default App
