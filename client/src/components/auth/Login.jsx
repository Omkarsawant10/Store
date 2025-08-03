import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Lock, UserCircle } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success('Login successful 🎉');
        const loggedInUser = res.data.user;
        setUser(loggedInUser);

        if (loggedInUser.role === 'ADMIN') navigate('/admin/dashboard');
        else if (loggedInUser.role === 'USER') navigate('/dashboard');
        else if (loggedInUser.role === 'OWNER') navigate('/owner/dashboard');
        else navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed ❌');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <UserCircle className="w-14 h-14 text-indigo-600" />
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select role</option>
              <option value="ADMIN">System Administrator</option>
              <option value="USER">Normal User</option>
              <option value="OWNER">Store Owner</option>
            </select>
          </div>

          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
