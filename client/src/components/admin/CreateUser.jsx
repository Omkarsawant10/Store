import { useState } from 'react';
import api from '../../services/api';
import { UserPlus } from 'lucide-react';
import { toast } from "react-toastify";

const roles = ['ADMIN', 'OWNER', 'USER'];

const initialForm = {
  name: '',
  email: '',
  password: '',
  address: '',
  role: 'USER',
};

export const CreateUser = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.address || !form.role) {
      toast('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/create-user', form);
      toast.success(res.data.message || 'User created successfully');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserPlus size={22} /> Create New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            minLength={20}
            maxLength={60}
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            pattern="^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            maxLength={400}
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};
