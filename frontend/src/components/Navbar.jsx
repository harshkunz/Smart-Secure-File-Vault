import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await api.post('/auth/logout');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-end items-center space-x-6">

      <Link to="/" className="text-white flex items-center space-x-1 hover:text-blue-300">
        <FaHome size={20} />
      </Link>

      {!isLoggedIn ? (
        <>
          <Link to="/login" className="text-white flex items-center space-x-1 hover:text-blue-300">
            <FaSignInAlt size={20} />
            <span className='text-sm'>Login</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/profile" className="text-white flex items-center space-x-1 hover:text-blue-300">
              <FaUser size={18} />
          </Link>

          <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`text-white flex items-center space-x-1 hover:text-blue-300 rounded
                ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaSignOutAlt size={20} />
              <span className="text-sm">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
          </button>
        </>
        
      )}
    </nav>
  );
};

export default Navbar;
