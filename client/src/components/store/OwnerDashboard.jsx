

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { FiLogOut, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

export const OwnerDashboard = () => {
  const [ratingsData, setRatingsData] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRatings = async () => {
    try {
      const res = await api.get("/store/my-ratings");
      setRatingsData(res.data);
      const avg = res.data[0]?.averageRating || "N/A";
      setAverageRating(avg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      toast.success("Logged out successfully");
      navigate("/login");
      
    } catch (err) {
      console.error("Logout failed ",err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
       
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Store Owner Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition duration-300"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>

        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🔐 Account Settings</h2>
          <button
            onClick={() => navigate("/update-password")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            <FiLock size={18} />
            Update Password
          </button>
        </div>

        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">⭐ Store Ratings</h2>
          {loading ? (
            <p className="text-gray-500">Loading ratings...</p>
          ) : (
            <>
              <p className="text-lg text-gray-600 mb-4">
                Average Rating: <span className="font-bold text-black">{averageRating}</span>
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b text-left font-medium text-gray-600">User Name</th>
                      <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Email</th>
                      <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsData.length > 0 &&
                      ratingsData[0].ratings.map((rating, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition border-b"
                        >
                          <td className="py-3 px-4">{rating.user.name}</td>
                          <td className="py-3 px-4">{rating.user.email}</td>
                          <td className="py-3 px-4 font-semibold text-yellow-600">{rating.value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
