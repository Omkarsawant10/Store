
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-6">
          Welcome to Store Rating Platform
        </h1>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Discover, rate, and review local stores. Whether you're a <span className="font-semibold">User</span>, a
          <span className="font-semibold"> Store Owner</span>, or an <span className="font-semibold">Admin</span> – there's a dedicated experience waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Store Rating App. Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
