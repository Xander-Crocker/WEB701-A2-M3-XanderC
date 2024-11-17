import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
              <Gamepad className="h-8 w-8 text-purple-600" />
              <span className="font-bold text-xl text-gray-900">Gaming4Good</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
                <Link to="/my-tickets" className="text-gray-700 hover:text-purple-600 flex items-center">
                  <Ticket className="h-4 w-4 mr-1" />
                  My Tickets
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;