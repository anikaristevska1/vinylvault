import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="state state--error">
        <h3>403 · Forbidden</h3>
        <p>This area is restricted to administrators.</p>
      </div>
    )
  }

  return children
}
