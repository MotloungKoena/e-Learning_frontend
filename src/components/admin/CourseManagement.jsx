import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, statusFilter, courses]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/all');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredCourses(filtered);
  };

  const approveCourse = async (courseId) => {
    try {
      await api.put(`/courses/${courseId}/publish`);
      setSuccess('Course approved successfully');
      fetchCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve course');
      setTimeout(() => setError(''), 3000);
    }
  };

  const rejectCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to reject this course? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/courses/${courseId}`);
      setSuccess('Course rejected and deleted');
      fetchCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject course');
      setTimeout(() => setError(''), 3000);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Course Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by course title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Courses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Course Thumbnail */}
              <div className="md:w-48 h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm">Course ID</p>
                  <p className="text-xl font-bold">#{course.id}</p>
                </div>
              </div>
              
              {/* Course Info */}
              <div className="flex-1 p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>Instructor: {course.instructor?.firstName} {course.instructor?.lastName}</span>
                      <span>Category: {course.category}</span>
                      <span>Price: ${course.price}</span>
                      <span>Enrollments: {course.enrollments?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                      title="View Course"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    {course.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => approveCourse(course.id)}
                          className="p-2 text-green-600 hover:text-green-800 transition"
                          title="Approve Course"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => rejectCourse(course.id)}
                          className="p-2 text-red-600 hover:text-red-800 transition"
                          title="Reject Course"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.status === 'PUBLISHED' ? 'Published' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No courses found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;