import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { AdminDashboard } from "./components/admin/AdminDashboard"
import { UserDashboard } from './components/User/UserDashboard';
import { OwnerDashboard } from './components/store/OwnerDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import UpdatePassword from './components/User/UpdatePassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />


              </ProtectedRoute>
            }
          />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>

  );
}

export default App;
