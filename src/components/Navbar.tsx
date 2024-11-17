import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaGamepad className="h-8 w-8 text-purple-600" />
              <span className="font-bold text-xl text-gray-900">Gaming4Good</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/events" className="text-gray-700 hover:text-purple-600">
              Events
            </Link>
            <Link to="/accessibility" className="text-gray-700 hover:text-purple-600">
              Accessibility
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-purple-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-purple-600">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              title="Toggle mobile menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/events" className="block text-gray-700 hover:text-purple-600">
              Events
            </Link>
            <Link to="/accessibility" className="block text-gray-700 hover:text-purple-600">
              Accessibility
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-purple-600">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block text-gray-700 hover:text-purple-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-purple-600">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-purple-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;