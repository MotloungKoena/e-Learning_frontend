/*import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import CourseList from './components/student/CourseList';
import CourseDetails from './components/student/CourseDetails';
import MyCourses from './components/student/MyCourses';
import CreateCourse from './components/instructor/CreateCourse';
import ManageCourses from './components/instructor/ManageCourses';
import UploadMaterial from './components/instructor/UploadMaterial';
import UserManagement from './components/admin/UserManagement';
import CourseApproval from './components/admin/CourseApproval';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
           <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

           <Route path="/my-courses" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyCourses />
            </ProtectedRoute>
          } />

           <Route path="/instructor/courses/create" element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses" element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
              <ManageCourses />
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/materials" element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
              <UploadMaterial />
            </ProtectedRoute>
          } />

           <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CourseApproval />
            </ProtectedRoute>
          } />

           <Route path="/" element={<Navigate to="/courses" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;*/

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CourseList from './components/student/CourseList';
import CourseDetails from './components/student/CourseDetails';

// Temporary placeholder components until we build them
const Home = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to E-Learning Platform</h1>
    <p className="text-xl text-gray-600">Start your learning journey today!</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;