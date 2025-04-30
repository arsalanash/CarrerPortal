import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/student');
    // try {
    //   await axios.post('http://localhost:5001/api/student/login', {
    //     email,
    //     password,
    //   });
    //   alert('Login successful.');
    //   navigate('/student');
    // } catch (error) {
    //   console.error('Error during login:', error);
    //   if (error.response?.status === 403) {
    //     alert(error?.response?.data?.message || 'Your account has not been approved yet');
    //   } else {
    //     alert('Login failed. Please check your email and password.');
    //   }
    // }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your email.');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Student Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email or Mobile</label>
            <input
              type="text"
              placeholder="Enter email or mobile number"
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
              value={password}
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
        
        <div className="mt-4 flex justify-between">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setShowModal(true)}
          >
            Forgot Password
          </button>
          <Link to="/student/register" className="text-blue-500 hover:underline">Register</Link>
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

export default StudentLoginPage;
