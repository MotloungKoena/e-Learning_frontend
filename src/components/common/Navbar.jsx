import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';

const Navbar = () => {
  // Temporary hardcoded state until we build AuthContext
  const isAuthenticated = false;

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
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
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