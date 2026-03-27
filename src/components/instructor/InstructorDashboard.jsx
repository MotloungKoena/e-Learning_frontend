import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getInstructorCourses, 
  publishCourse, 
  deleteCourse 
} from '../../services/courses';
import { BookOpen, Users, Eye, Edit, Trash2, PlusCircle, CheckCircle, XCircle } from 'lucide-react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load your courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId) => {
    try {
      await publishCourse(courseId);
      setSuccess('Course published successfully!');
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError('Failed to publish course');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteCourse(courseId);
      setSuccess('Course deleted successfully!');
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError('Failed to delete course');
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.firstName}! Manage your courses below.
          </p>
        </div>
        <Link
          to="/instructor/courses/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="h-5 w-5" />
          Create New Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {courses.filter(c => c.status === 'PUBLISHED').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {courses.filter(c => c.status === 'DRAFT').length}
              </p>
            </div>
            <Edit className="h-10 w-10 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
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

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Create your first course to get started.</p>
          <Link
            to="/instructor/courses/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                {/* Course Thumbnail */}
                <div className="md:w-48 h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white opacity-50" />
                </div>
                
                {/* Course Info */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h2>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-gray-500">Category: {course.category}</span>
                        <span className="text-gray-500">Price: ${course.price}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          course.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/instructor/courses/${course.id}/students`}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        title="View Students"
                      >
                        <Users className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="p-2 text-gray-600 hover:text-yellow-600 transition"
                        title="Edit Course"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      {course.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(course.id)}
                          className="p-2 text-gray-600 hover:text-green-600 transition"
                          title="Publish Course"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition"
                        title="Delete Course"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;