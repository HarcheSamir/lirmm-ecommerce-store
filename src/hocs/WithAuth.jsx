// src/hocs/WithAuth.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'

const WithAuth = ({ children }) => {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore()
  const location = useLocation()
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser()
      setHasCheckedAuth(true)
    }
    
    checkAuth()
  }, [fetchUser])

  // Always show loading until we've completed the initial auth check
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Render children if authenticated
  return children
}

export default WithAuth