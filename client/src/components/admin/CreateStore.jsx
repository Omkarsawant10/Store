import { useState } from 'react';
import api from '../../services/api';
import { Store } from 'lucide-react';
import { toast } from "react-toastify";

const initialForm = {
  name: '',
  email: '',
  address: '',
  ownerId: '',
};

export const CreateStore = () => {
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

    if (!form.name || !form.email || !form.address || !form.ownerId) {
      toast('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/create-store', form);
      toast.success(res.data.message || 'Store created successfully');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Store size={22} /> Create New Store
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Store Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter store name"
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
            placeholder="Enter store email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Owner ID</label>
          <input
            type="text"
            name="ownerId"
            className="w-full border px-3 py-2 rounded-lg outline-blue-500"
            value={form.ownerId}
            onChange={handleChange}
            placeholder="Enter owner ID"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};
