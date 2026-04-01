import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Users, BookOpen, TrendingUp, Award, CheckCircle, XCircle, UserCheck, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    pendingInstructors: 0,
    totalCourses: 0,
    publishedCourses: 0,
    pendingCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [users, courses, enrollments] = await Promise.all([
        api.get('/users/all'),
        api.get('/courses/all'),
        api.get('/enrollments/all').catch(() => ({ data: [] }))
      ]);

      const usersData = users.data;
      const coursesData = courses.data;
      const enrollmentsData = enrollments.data || [];

      const instructors = usersData.filter(u => u.role === 'INSTRUCTOR');
      const pendingInstructors = instructors.filter(i => i.status === 'PENDING');
      const pendingCourses = coursesData.filter(c => c.status === 'DRAFT');

      setStats({
        totalUsers: usersData.length,
        totalStudents: usersData.filter(u => u.role === 'STUDENT').length,
        totalInstructors: instructors.length,
        pendingInstructors: pendingInstructors.length,
        totalCourses: coursesData.length,
        publishedCourses: coursesData.filter(c => c.status === 'PUBLISHED').length,
        pendingCourses: pendingCourses.length,
        totalEnrollments: enrollmentsData.length,
        totalRevenue: 0 // Will implement with Stripe later
      });

      // Get recent users (last 5)
      setRecentUsers(usersData.slice(-5).reverse());
      
      // Get recent courses (last 5)
      setRecentCourses(coursesData.slice(-5).reverse());

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName}! Manage your platform here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-green-600">👨‍🎓 {stats.totalStudents} students</span>
                <span className="text-blue-600">👨‍🏫 {stats.totalInstructors} instructors</span>
              </div>
            </div>
            <Users className="h-10 w-10 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-green-600">✓ {stats.publishedCourses} published</span>
                <span className="text-yellow-600">📝 {stats.pendingCourses} pending</span>
              </div>
            </div>
            <BookOpen className="h-10 w-10 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEnrollments}</p>
              <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingInstructors + stats.pendingCourses}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-yellow-600">👨‍🏫 {stats.pendingInstructors} instructors</span>
                <span className="text-yellow-600">📚 {stats.pendingCourses} courses</span>
              </div>
            </div>
            <Clock className="h-10 w-10 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
              <p className="text-sm text-gray-600">Manage users, approve instructors, block accounts</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/courses"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Course Management</h2>
              <p className="text-sm text-gray-600">Review and approve courses, manage content</p>
            </div>
          </div>
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-purple-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Platform Settings</h2>
              <p className="text-sm text-gray-600">Configure platform settings (coming soon)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {u.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No users found</p>
            )}
          </div>
          <Link to="/admin/users" className="mt-4 text-blue-600 hover:text-blue-700 text-sm block text-center">
            View All Users →
          </Link>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Courses</h2>
          <div className="space-y-3">
            {recentCourses.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-800">{c.title}</p>
                  <p className="text-sm text-gray-500">By {c.instructor?.firstName} {c.instructor?.lastName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    c.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">${c.price}</span>
                </div>
              </div>
            ))}
            {recentCourses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No courses found</p>
            )}
          </div>
          <Link to="/admin/courses" className="mt-4 text-blue-600 hover:text-blue-700 text-sm block text-center">
            View All Courses →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;