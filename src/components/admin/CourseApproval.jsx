import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const CourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const approveCourse = async (courseId) => {
    try {
      await api.put(`/courses/${courseId}/publish`);
      fetchCourses();
    } catch (err) {
      setError('Failed to approve course');
    }
  };

  const rejectCourse = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (err) {
      setError('Failed to reject course');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingCourses = courses.filter(c => c.status === 'DRAFT');
  const publishedCourses = courses.filter(c => c.status === 'PUBLISHED');

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Course Approval</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Pending Approval Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Approval ({pendingCourses.length})</h2>
        {pendingCourses.length === 0 ? (
          <p className="text-gray-500">No courses pending approval</p>
        ) : (
          <div className="space-y-4">
            {pendingCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Instructor: {course.instructor?.firstName} {course.instructor?.lastName}</span>
                      <span>Category: {course.category}</span>
                      <span>Price: ${course.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveCourse(course.id)}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Approve Course"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => rejectCourse(course.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Reject Course"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published Courses Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Published Courses ({publishedCourses.length})</h2>
        {publishedCourses.length === 0 ? (
          <p className="text-gray-500">No published courses yet</p>
        ) : (
          <div className="space-y-4">
            {publishedCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Instructor: {course.instructor?.firstName} {course.instructor?.lastName}</span>
                      <span>Category: {course.category}</span>
                      <span>Price: ${course.price}</span>
                      <span className="text-green-600">Published ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseApproval;