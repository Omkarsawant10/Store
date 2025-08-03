const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
        <h3 className="text-lg">Total Users</h3>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded-lg shadow">
        <h3 className="text-lg">Total Stores</h3>
        <p className="text-2xl font-bold">{stats.totalStores}</p>
      </div>
      <div className="bg-purple-500 text-white p-4 rounded-lg shadow">
        <h3 className="text-lg">Total Ratings</h3>
        <p className="text-2xl font-bold">{stats.totalRatings}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
