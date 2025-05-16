import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-end items-center space-x-6">

      <Link to="/" className="text-white flex items-center space-x-1 hover:text-blue-300">
        <FaHome size={20} />
      </Link>

      {!!isLoggedIn ? (
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
            className="text-white flex items-center space-x-1 hover:text-blue-300 rounded"
          >
            <FaSignOutAlt size={20} />
            <span className='text-sm'>Logout</span>
          </button>
        </>
        
      )}
    </nav>
  );
};

export default Navbar;
