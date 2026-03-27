import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

//navbar
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('Navbar - isAuthenticated:', isAuthenticated);
  console.log('Navbar - user:', user);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">E-Learn</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/courses" className="text-gray-600 hover:text-blue-600">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'INSTRUCTOR' && (
                  <Link to="/instructor/courses" className="text-gray-600 hover:text-blue-600">
                    My Courses
                  </Link>
                )}
                {user?.role === 'STUDENT' && (
                  <Link to="/my-learning" className="text-gray-600 hover:text-blue-600">
                    My Learning
                  </Link>
                )}
                {user?.role === 'INSTRUCTOR' && (
                  <>
                    <Link to="/instructor/dashboard" className="text-gray-600 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link to="/instructor/courses/create" className="text-gray-600 hover:text-blue-600">
                      Create Course
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">
                    Hi, {user?.firstName || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;