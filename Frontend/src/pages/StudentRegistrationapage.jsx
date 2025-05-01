import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const StudentRegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gpa, setGpa] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number.';
    }
    if (!gpa) {
      newErrors.gpa = 'GPA is required.';
    } else if (isNaN(gpa) || gpa < 0 || gpa > 10) {
      newErrors.gpa = 'GPA must be a number between 0 and 10.';
    }
    if (!department.trim()) {
      newErrors.department = 'Department is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/student/register', {
        fullName,
        email,
        password,
        gpa,
        department,
      });

      alert('Request sent to admin for approval. You will be notified once approved.');
      setTimeout(() => {
        navigate('/student/login');
      }, 2000);
    } catch (error) {
      console.error('Error registering student:', error);
      const errorMessage =
        error?.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Student Registration
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.password}
              </p>
            )}
          </div>

          {/* GPA Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="gpa">
              GPA
            </label>
            <input
              id="gpa"
              type="number"
              step="0.01"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.gpa ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your GPA (0-10)"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              required
            />
            {errors.gpa && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.gpa}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
              Department
            </label>
            <input
              id="department"
              type="text"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            {errors.department && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.department}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/student/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterPage;