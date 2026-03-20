import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseById, enrollInCourse, getCourseMaterials, getCourseRatingSummary, rateCourse } from '../../services/courses';
import { BookOpen, Star, Clock, Users, PlayCircle, FileText, ChevronLeft } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseData, materialsData, ratingData] = await Promise.all([
        getCourseById(id),
        getCourseMaterials(id).catch(() => []), // Materials might be protected
        getCourseRatingSummary(id).catch(() => null)
      ]);
      
      setCourse(courseData);
      setMaterials(materialsData);
      setRatingSummary(ratingData);
    } catch (err) {
      setError('Failed to load course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      await enrollInCourse(id);
      setSuccess('Successfully enrolled! You can now access course materials.');
      // Refresh materials (they should now be accessible)
      const materialsData = await getCourseMaterials(id);
      setMaterials(materialsData);
    } catch (err) {
      setError(err.response?.data || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await rateCourse(id, userRating, userReview);
      setShowRatingForm(false);
      // Refresh rating summary
      const ratingData = await getCourseRatingSummary(id);
      setRatingSummary(ratingData);
      setSuccess('Thank you for your rating!');
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Courses
      </button>

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

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <BookOpen className="h-32 w-32 text-white opacity-25" />
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
              <p className="text-gray-600">Created by {course.instructor?.firstName} {course.instructor?.lastName}</p>
            </div>
            <span className="text-3xl font-bold text-blue-600">${course.price}</span>
          </div>

          <p className="text-gray-700 mb-6">{course.description}</p>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-2 text-gray-700">
                {ratingSummary?.averageRating || 'New'} ({ratingSummary?.totalRatings || 0} ratings)
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-gray-700">{course.enrollments?.length || 0} students</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-gray-700">Self-paced</span>
            </div>
          </div>

          {/* Enroll Button */}
          {(!isAuthenticated || isStudent) && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
            </button>
          )}
        </div>
      </div>

      {/* Course Materials */}
      {materials.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Materials</h2>
          <div className="space-y-4">
            {materials.map(material => (
              <div key={material.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                {material.fileType === 'VIDEO' ? (
                  <PlayCircle className="h-6 w-6 text-blue-600 mr-3" />
                ) : (
                  <FileText className="h-6 w-6 text-green-600 mr-3" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{material.title}</h3>
                  {material.description && (
                    <p className="text-sm text-gray-600">{material.description}</p>
                  )}
                </div>
                {material.duration && (
                  <span className="text-sm text-gray-500">{material.duration} min</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Section */}
      {isAuthenticated && isStudent && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rate This Course</h2>
          
          {!showRatingForm ? (
            <button
              onClick={() => setShowRatingForm(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  required
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience with this course..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;