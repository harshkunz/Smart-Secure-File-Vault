import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await axios.post("http://localhost:5000/auth/login", form, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log('Login successful');

        const { token, user } = res.data;
        setUser(user);
        localStorage.setItem('token', token);
        navigate(location.state?.from || '/');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="border border-blue-300 bg-black p-6 w-full max-w-sm sm:max-w-md text-white transition-shadow duration-200 ease-in-out 
              hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]"
      >
        <h2 className="text-2xl font-medium mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4 p-3">
          <label htmlFor="email" className="block font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent px-3 py-1 hover:bg-white hover:bg-opacity-20 border-b focus:outline-none"
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
            className="w-full bg-transparent px-3 py-1 hover:bg-white hover:bg-opacity-20 border-b focus:outline-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="border text-white py-2 px-12 hover:bg-white hover:text-black"
          >
            Login
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline p-1 border-b ">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
