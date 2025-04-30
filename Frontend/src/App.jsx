import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentRegisterPage from './pages/StudentRegistrationapage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/student/register" element={<StudentRegisterPage />} />
      <Route path="/create-root-admin" element={<AdminRegisterPage />} />
      {/* <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentDashboard />} /> */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedUserType="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;