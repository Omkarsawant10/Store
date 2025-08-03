
import { useEffect, useState } from "react";
import { Loader } from "../common/Loader";
import DashboardStats from "./DashboardStats";
import { CreateUser } from "./CreateUser";
import { CreateStore } from "./CreateStore";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Sparkles, Store, Users, LogOut } from "lucide-react";
import StarDisplay from "./StarDisplay";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userSortConfig, setUserSortConfig] = useState({ key: "name", direction: "asc" });
  const [storeSortConfig, setStoreSortConfig] = useState({ key: "name", direction: "asc" });
  const [userSearch, setUserSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/admin/dashboard", { withCredentials: true });
      if (res.data?.stats && Array.isArray(res.data.users) && Array.isArray(res.data.stores)) {
        setStats(res.data.stats);
        setUsers(res.data.users);
        setStores(res.data.stores);
      } else {
        throw new Error("Malformed response");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    toast.success("User created successfully!");
  };

  const handleStoreCreated = (newStore) => {
    setStores((prev) => [...prev, newStore]);
    setStats((prev) => ({ ...prev, totalStores: prev.totalStores + 1 }));
    toast.success("Store created successfully!");
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.log(err)
      toast.error("Logout failed");
    }
  };

  const sortData = (data, config) => {
    return [...data].sort((a, b) => {
      const aVal = a[config.key]?.toString().toLowerCase();
      const bVal = b[config.key]?.toString().toLowerCase();
      if (aVal < bVal) return config.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return config.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleUserSort = (key) => {
    setUserSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleStoreSort = (key) => {
    setStoreSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (config, key) => {
    if (config.key !== key) return "";
    return config.direction === "asc" ? "▲" : "▼";
  };

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();
    const roleMatch = userRoleFilter === "ALL" || user.role.toLowerCase() === userRoleFilter.toLowerCase();
    return (
      roleMatch &&
      (user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.address.toLowerCase().includes(search))
    );
  });

  const filteredStores = stores.filter((store) => {
    const search = storeSearch.toLowerCase();
    return (
      store.name.toLowerCase().includes(search) ||
      store.email.toLowerCase().includes(search) ||
      store.address.toLowerCase().includes(search)
    );
  });

  const sortedUsers = sortData(filteredUsers, userSortConfig);
  const sortedStores = sortData(filteredStores, storeSortConfig);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700">
        <h1 className="text-xl font-semibold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-blue-600" /> Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <CreateUser onUserCreated={handleUserCreated} />
          <CreateStore onStoreCreated={handleStoreCreated} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-green-600" /> Users
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, email, address..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/2"
            />
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/4"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
              <option value="USER">User</option>
            </select>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  {["id", "name", "email", "address", "role"].map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleUserSort(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIcon(userSortConfig, key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.address}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Store className="text-purple-600" /> Stores
          </h2>

          <input
            type="text"
            placeholder="Search by name, email, address..."
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
            className="mb-4 px-3 py-2 border border-gray-300 rounded w-full md:w-1/2"
          />

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleStoreSort("name")}>
                    Name {getSortIcon(storeSortConfig, "name")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleStoreSort("email")}>
                    Email {getSortIcon(storeSortConfig, "email")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleStoreSort("address")}>
                    Address {getSortIcon(storeSortConfig, "address")}
                  </th>
                  <th className="px-4 py-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedStores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  sortedStores.map((store, idx) => (
                    <tr
                      key={store.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-4 py-2">{store.name}</td>
                      <td className="px-4 py-2">{store.email}</td>
                      <td className="px-4 py-2">{store.address}</td>
                      <td className="px-4 py-2 flex items-center justify-center gap-2">
                        {store.rating !== "N/A" ? (
                          <>
                            <StarDisplay rating={parseFloat(store.rating)} />
                            <span className="text-sm text-gray-500">({store.rating})</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
