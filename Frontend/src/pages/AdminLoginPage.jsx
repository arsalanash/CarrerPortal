import { useState, useEffect, useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rootAdminExists, setRootAdminExists] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const checkRootAdmin = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/check-root-admin');
      setRootAdminExists(response.data.exists);
    } catch (error) {
      console.error('Error checking root admin:', error);
    }
  };

  useEffect(() => {
    checkRootAdmin();
  }, []);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   navigate('/admin-dashboard');
  //   try {
  //     await axios.post('http://localhost:5001/api/admin/login', { email, password });
  //     navigate('/admin-dashboard');
  //   } catch (error) {
  //     alert('Login failed. Please check your credentials.',error);
  //   }
  // };
  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
  
    if (response.ok) {
      const { token, userType } = data; // Assuming the server returns token and userType
      login(token, userType); // Call the login function from AuthContext
      navigate('/admin-dashboard');
    } else {
      console.error('Login failed:', data.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your email.');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Admin Login</h2>
        <div className="mb-3 text-center">
          <button
            className={`text-blue-500 hover:underline ${rootAdminExists ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={rootAdminExists}
            onClick={() => navigate('/create-root-admin')}
          >
            Create Admin
          </button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setShowModal(true)}
          >
            Forgot Password?
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-lg font-bold">Forgot Password</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
