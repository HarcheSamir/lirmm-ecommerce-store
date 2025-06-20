import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiGrid } from 'react-icons/fi';

export default function ProfileDropdown({ user, onLogout }) {
  if (!user) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-100/80 z-50 overflow-hidden animate-scaleIn">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=262C32&color=fff`}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover bg-gray-200"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-800 truncate">{user.name}</h4>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <Link to="/account" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors">
          <FiUser className="w-4 h-4" />
          <span>My Account</span>
        </Link>
        {user.role === 'ADMIN' && (
             <Link to="/dashboard" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors">
                <FiGrid className="w-4 h-4" />
                <span>Dashboard</span>
            </Link>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}