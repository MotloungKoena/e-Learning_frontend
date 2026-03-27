import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, courses, enrollments] = await Promise.all([
        api.get('/users/all'),
        api.get('/courses/all'),
        api.get('/enrollments/all')
      ]);
      
      setStats({
        totalUsers: users.data.length,
        totalCourses: courses.data.length,
        totalEnrollments: enrollments.data.length,
        totalRevenue: 0 // Add revenue calculation later
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Manage your platform here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
            </div>
            <BookOpen className="h-10 w-10 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEnrollments}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue}</p>
            </div>
            <Award className="h-10 w-10 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User Management</h2>
          <p className="text-gray-600">Manage users, approve instructors, block accounts</p>
        </Link>
        
        <Link to="/admin/courses" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Management</h2>
          <p className="text-gray-600">Review and approve courses, manage content</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;