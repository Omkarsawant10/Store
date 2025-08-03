import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  User,
  Mail,
  Lock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData, { withCredentials: true });
      toast.success('Registration successful. Please login!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          <ShieldCheck className="inline w-8 h-8 mr-2 text-indigo-500" />
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <User className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                minLength={20}
                maxLength={60}
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Mail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Address</label>
            <div className="flex items-start border border-gray-300 rounded-md px-3 py-2">
              <MapPin className="text-gray-400 mt-1 mr-2" />
              <textarea
                name="address"
                placeholder="Enter your address"
                maxLength={400}
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full resize-none focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="8+ chars, 1 uppercase, 1 special"
                pattern="^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
                title="8-16 chars, 1 uppercase and 1 special char"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="USER">Normal User</option>
              <option value="OWNER">Store Owner</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
