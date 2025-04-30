import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rootAdminExists, setRootAdminExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', { email, password });
     
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      // Store admin details in userType
      const userType = "admin"; // Store the admin object in userType
      login(response.data.data.accessToken, userType);

      // Navigate to the admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await axios.post('http://localhost:8000/api/admin/forgot-password', { email });
      alert('Password reset link has been sent to your email.');
      setShowModal(false);
    } catch (error) {
      setErrorMessage('Failed to send reset link. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Admin Login</h2>
        <div className="mb-3 text-center">
          <button
            className={`text-blue-500 hover:underline transition ${rootAdminExists ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={rootAdminExists}
            onClick={() => navigate('/create-root-admin')}
            aria-disabled={rootAdminExists}
          >
            Create Admin
          </button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
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
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-lg font-bold">Forgot Password</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label htmlFor="forgot-email" className="block text-gray-700">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                <button
                  type="submit"
                  className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
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