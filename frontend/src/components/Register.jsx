import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import axios from 'axios';

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
      const res = await axios.post("http://localhost:5000/auth/register", form, {
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
    <div className="flex justify-center items-center min-h-screen bg-none">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 shadow-sm w-full max-w-md"
      >
        <h2 className="text-2xl font-medium mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

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
            Register
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
        
      </form>
    </div>
  );
};

export default Register;
