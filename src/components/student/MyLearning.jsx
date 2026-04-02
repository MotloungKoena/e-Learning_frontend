import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyEnrolledCourses, updateEnrollmentProgress } from '../../services/courses';
import { BookOpen, PlayCircle, CheckCircle, Clock, Award } from 'lucide-react';
import { MyLearningCardSkeleton, StatsCardSkeleton } from '../common/Skeleton';
import toast from 'react-hot-toast';

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const data = await getMyEnrolledCourses();
      setEnrollments(data);
    } catch (err) {
      setError('Failed to load your enrolled courses');
      toast.error('Failed to load your enrolled courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (enrollmentId, newProgress) => {
    setUpdating(enrollmentId);
    try {
      const updated = await updateEnrollmentProgress(enrollmentId, newProgress);
      setEnrollments(prev => prev.map(e => 
        e.id === enrollmentId ? { ...e, progress: updated.progress, completed: updated.completed } : e
      ));
      toast.success(`Progress updated to ${newProgress}%!`);
    } catch (err) {
      console.error('Failed to update progress:', err);
      toast.error('Failed to update progress');
    } finally {
      setUpdating(null);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 25) return 'bg-blue-400';
    if (progress < 50) return 'bg-blue-500';
    if (progress < 75) return 'bg-blue-600';
    if (progress < 100) return 'bg-blue-700';
    return 'bg-green-600';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="animate-pulse bg-gray-200 h-8 w-48 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-96 rounded"></div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        
        {/* Course List Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <MyLearningCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Learning</h1>
        <p className="text-gray-600 mt-2">
          Continue your learning journey where you left off
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-800">{enrollments.length}</p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {enrollments.filter(e => e.completed).length}
              </p>
            </div>
            <Award className="h-10 w-10 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / (enrollments.length || 1))}%
              </p>
            </div>
            <Clock className="h-10 w-10 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Enrolled Courses List */}
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map(enrollment => (
            <div key={enrollment.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                {/* Course Thumbnail */}
                <div className="md:w-64 h-48 md:h-auto bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-50" />
                </div>
                
                {/* Course Info */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {enrollment.course?.title}
                      </h2>
                      <p className="text-gray-600 mb-2">
                        Created by {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {enrollment.course?.category}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {enrollment.completed ? (
                        <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(enrollment.progress)}`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/courses/${enrollment.course?.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                    
                    {enrollment.progress < 100 && !enrollment.completed && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateProgress(enrollment.id, Math.min(enrollment.progress + 10, 100))}
                          disabled={updating === enrollment.id}
                          className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                        >
                          +10% Progress
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(enrollment.id, 100)}
                          disabled={updating === enrollment.id}
                          className="px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
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

export default MyLearning;