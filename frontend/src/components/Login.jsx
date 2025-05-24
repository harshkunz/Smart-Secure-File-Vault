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
    <div className="flex justify-center items-center min-h-screen bg-none">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 shadow-sm w-full max-w-md"
      >
        <h2 className="text-2xl font-medium mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-12 rounded-sm hover:bg-blue-700"
          >
            Login
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
