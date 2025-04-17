import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const { user, logout, hasRole } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Book Management
              </Link>
              
              <nav className="ml-6 flex space-x-4">
                <Link 
                  to="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/books" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Books
                </Link>
                {hasRole(['ADMIN']) && (
                  <Link 
                    to="/books/create" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Add Book
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {user?.name}
                  {user?.role === 'ADMIN' && (
                    <span className="ml-1 text-xs text-blue-600">(Admin)</span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Book Management App
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout