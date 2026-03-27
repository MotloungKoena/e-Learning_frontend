import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/NavBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CourseList from './components/student/CourseList';
import CourseDetails from './components/student/CourseDetails';
import ProtectedRoute from './components/common/ProtectedRoute';
import MyLearning from './components/student/MyLearning';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import CreateCourse from './components/instructor/CreateCourse';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import CourseApproval from './components/admin/CourseApproval';
import MaterialPlayer from './components/student/MaterialPlayer';

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
              <Route path="/my-learning" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MyLearning />
                </ProtectedRoute>
              } />
              <Route path="/instructor/dashboard" element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/instructor/courses/create" element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
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
              <Route path="/courses/:courseId/materials/:materialId" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MaterialPlayer />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;