// src/hocs/WithRole.jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const WithRole = ({ children, roles = [] }) => {
  const hasRole = useAuthStore(state => state.hasRole)
  
  // Check if the user has the required role
  if (!hasRole(roles)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/" replace />
  }

  // Render children if user has the required role
  return children
}

export default WithRole