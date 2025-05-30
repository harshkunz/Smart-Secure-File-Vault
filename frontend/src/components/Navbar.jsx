import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { FaFileShield } from "react-icons/fa6";
import { GoPersonAdd, GoSignOut } from "react-icons/go";
import { PiSignOutLight, PiSignInLight, PiFile, PiUser } from "react-icons/pi";
import { UserData } from '../context/UserContext';
import logo from '../assets/logo.png';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, setUser } = useContext(UserData);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get(`${BASE_URL}/auth/logout`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      console.log('Logout successful');
      
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black p-2 flex justify-between items-center h-14">
      {/* Logo - always shown */}
      <Link to="/" className="text-white flex items-left space-x-2 px-3">
        <img src={logo} alt="Logo" className="h-10" />
      </Link>

      {/* Right side */}
      <div className="flex items-center space-x-6 px-4">
        {!isLoggedIn ? (
          <>
            <Link to="/register" className="text-gray-300 flex items-center hover:text-white">
              <GoPersonAdd size={24} className='block md:hidden'/>
              <span className="text-sm hidden md:inline">Sign up</span>
            </Link>
            <Link to="/login" className="text-gray-300 flex items-center hover:text-white">
              <PiSignInLight size={24} className='block md:hidden' />
              <span className="text-sm hidden md:inline">Log in</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/files" className="text-gray-300 flex items-center hover:text-white">
              <PiFile size={24} className='block md:hidden' />
              <span className="text-sm hidden md:inline">Files</span>
            </Link>

            <Link to="/profile" className="text-gray-300 flex items-center hover:text-white">
              <PiUser size={24} className='block md:hidden' />
              <span className="text-sm hidden md:inline">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`text-gray-300 flex items-center hover:text-white ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <PiSignOutLight size={24} className='block md:hidden' />
              <span className="text-sm hidden md:inline">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
