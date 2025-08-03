import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { LogOut, Lock, Star, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

export const UserDashboard = () => {
  const { user, logoutUser, loading } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get('/store/get', { withCredentials: true });
      setStores(res.data);
      setFilteredStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
    );
    setFilteredStores(filtered);
  };

  const handleRatingSubmit = async (storeId, ratingValue) => {
    try {
      const res = await api.post("/user/rate", { storeId, value: ratingValue });
      if (res.status === 201) toast.success("Rating submitted!");
      updateStoreRatingUI(storeId, ratingValue);
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const res = await api.put("/user/rate", { storeId, value: ratingValue });
          if (res.status === 200) toast.success("Rating updated!");
          updateStoreRatingUI(storeId, ratingValue);
        } catch (updateErr) {
          console.log(updateErr)
          toast.error("Failed to update rating");
        }
      } else {
        toast.error("Error submitting rating");
      }
    }
  };

  const updateStoreRatingUI = (storeId, userRating) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          const ratings = [...(store.ratings || [])];
          const existing = ratings.find((r) => r.userId === user?.id);

          if (existing) {
            existing.value = userRating;
          } else {
            ratings.push({ userId: user?.id, value: userRating });
          }

          const avg = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;

          return {
            ...store,
            userSubmittedRating: userRating,
            averageRating: avg.toFixed(1),
            ratings,
          };
        }
        return store;
      })
    );
  };

  useEffect(() => {
    if (search.trim()) {
      handleSearch({ target: { value: search } });
    } else {
      setFilteredStores(stores);
    }
  }, [stores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user?.name}</span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/update-password')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition flex items-center gap-2"
            >
              <Lock size={16} /> Update Password
            </button>
            <button
              onClick={logoutUser}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow transition flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {filteredStores.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No stores found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                      {store.name}
                    </h2>
                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                      ID: {store.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-500" />
                    <p>{store.address}</p>
                  </div>

                  <div className="text-sm text-gray-700 flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" />
                    <span className="font-medium">Avg Rating:</span>
                    <span className="text-gray-800 font-semibold">
                      {store.averageRating || 'N/A'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Rating:
                    </label>
                    <StarRating
                      storeId={store.id}
                      initialRating={store.userSubmittedRating}
                      onRatingSubmit={handleRatingSubmit}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
