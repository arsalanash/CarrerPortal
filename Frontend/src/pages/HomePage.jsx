import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center transform transition duration-300 hover:scale-105 w-full max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 animate-fadeIn">CareerMosaic</h1>
        <h2 className="text-xl mb-8 animate-fadeIn delay-200">
          Placement Info Portal for Students
        </h2>
        <div className="flex justify-center space-x-6">
          <Link to="/admin/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transform transition hover:scale-105 animate-fadeIn delay-300">
              Admin
            </button>
          </Link>
          <Link to="/student/login">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transform transition hover:scale-105 animate-fadeIn delay-400">
              Student
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;