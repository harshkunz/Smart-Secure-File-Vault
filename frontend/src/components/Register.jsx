import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import c1 from '../assets/c1.jpg';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Registration successful');

      if (res.status === 201 || res.status === 200) {
        const { token, user } = res.data;
        setUser(user);
        localStorage.setItem('token', token);
        navigate(location.state?.from || '/');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen relative bg-black">
      {/* Background Layer */}
      <div
        className="h-full w-full absolute inset-0 bg-cover bg-center filter opacity-50"
        style={{ backgroundImage: `url(${c1})` }}
      />

      {/* Form Container */}
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="border border-blue-300 p-6 w-full max-w-sm sm:max-w-md text-white
                    transition-shadow duration-200 ease-in-out hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]"
        >
          <h2 className="text-2xl font-medium mb-4 text-center">Register</h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="mb-4 p-3">
            <label htmlFor="name" className="block font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border-b bg-transparent px-3 py-1 hover:bg-white hover:bg-opacity-20 focus:outline-none"
            />
          </div>

          <div className="mb-4 p-3">
            <label htmlFor="email" className="block font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border-b bg-transparent px-3 py-1 hover:bg-white hover:bg-opacity-20 focus:outline-none"
            />
          </div>

          <div className="mb-6 p-3">
            <label htmlFor="password" className="block font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border-b bg-transparent px-3 py-1 hover:bg-white hover:bg-opacity-20 focus:outline-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="border text-white py-2 px-12 hover:bg-white hover:text-black"
            >
              Register
            </button>
          </div>

          <div className="flex justify-center mt-5">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline border-b p-1">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
